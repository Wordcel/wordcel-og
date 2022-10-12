import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const appName = 'og-image-generator';

const stackConfig = new pulumi.Config("og-image-generator");

const config = {
    targetDomain: stackConfig.require("targetDomain"),
    certificateArn: stackConfig.get("certificateArn"),
    includeWWW: stackConfig.getBoolean("includeWWW") ?? true,
};

const LAMBDA_ROLE = {
    'Version': '2012-10-17',
    'Statement': [
        {
            'Effect': 'Allow',
            'Principal': {
                'Service': [
                    'lambda.amazonaws.com',
                    'edgelambda.amazonaws.com'
                ]
            },
            'Action': 'sts:AssumeRole'
        }
    ]
}

// create a new s3 bucket with public read access to all objects
const bucket = new aws.s3.Bucket(`${appName}-assets`, {
    acl: "public-read",
    tags: {
        Name: `${appName}-bucket`,
    },
});

const wdclclub = new aws.route53.Zone("wdclclub", {
    comment: "HostedZone created by Route53 Registrar",
    name: "wdclclub.com",
}, {
    protect: true,
});

let certificateArn: pulumi.Input<string> = config.certificateArn!;

if (config.certificateArn === undefined) {
    // Create a certificate for the domain name 
    const eastRegion = new aws.Provider("east", {
        profile: aws.config.profile,
        region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
    });
    const certificate = new aws.acm.Certificate("certificate", {
        domainName: config.targetDomain,
        validationMethod: "DNS",
        subjectAlternativeNames: config.includeWWW ? [`www.${config.targetDomain}`] : [],
    }, {provider: eastRegion});

    // Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
    // See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
    const certificateValidationDomain = new aws.route53.Record(`${config.targetDomain}-certificateValidation`, {
        name: certificate.domainValidationOptions[0].resourceRecordName,
        zoneId: wdclclub.zoneId,
        type: certificate.domainValidationOptions[0].resourceRecordType,
        records: [certificate.domainValidationOptions[0].resourceRecordValue],
        ttl: 60 * 10,
    }, {dependsOn: [wdclclub, certificate]});

    // if config.includeWWW ensure we validate the www subdomain as well
    let subdomainCertificateValidationDomain;
    if (config.includeWWW) {
        subdomainCertificateValidationDomain = new aws.route53.Record(`${config.targetDomain}-validation2`, {
            name: certificate.domainValidationOptions[1].resourceRecordName,
            zoneId: wdclclub.zoneId,
            type: certificate.domainValidationOptions[1].resourceRecordType,
            records: [certificate.domainValidationOptions[1].resourceRecordValue],
            ttl: 60 * 10,
        });
    }

    // if config.includeWWW include the validation record for the www subdomain
    const validationRecordFqdns = subdomainCertificateValidationDomain === undefined ?
        [certificateValidationDomain.fqdn] : [certificateValidationDomain.fqdn, subdomainCertificateValidationDomain.fqdn];


    // Wait for ACM to complete validation via DNS before creating the certificate.
    const certificateValidation = new aws.acm.CertificateValidation("certificateValidation", {
        certificateArn: certificate.arn,
        validationRecordFqdns: validationRecordFqdns,
    }, {provider: eastRegion});

    certificateArn = certificateValidation.certificateArn;
}

const distributionAliases = config.includeWWW ? [config.targetDomain, `www.${config.targetDomain}`] : [config.targetDomain];

const role = new aws.iam.Role(
    `${appName}-role`,
    {
        path: '/service-role/',
        assumeRolePolicy: JSON.stringify(LAMBDA_ROLE),
    }
);

const rolePolicy = new aws.iam.RolePolicy(
    `${appName}-role-policy`,
    {
        role: role.id,
        policy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: [
                        "logs:CreateLogGroup",
                        "logs:CreateLogStream",
                        "logs:PutLogEvents"
                    ],
                    Effect: "Allow",
                    Resource: "arn:aws:logs:*:*:*"
                },
                {
                    Action: [
                        "iam:DeleteRolePolicy",
                    ],
                    Effect: "Allow",
                    Resource: "*"
                }
            ]
        }
    }
);

// Policy for allowing Lambda to interact with S3
const lambdaS3Policy = new aws.iam.Policy("lambda-s3-policy", {
  description: "IAM policy for Lambda to interact with S3",
  path: "/",
  policy: bucket.arn.apply(bucketArn => `{
   "Version": "2012-10-17",
   "Statement": [
     {
       "Action": [ "s3:*"],
       "Resource": "${bucketArn}/*",
       "Effect": "Allow"
     }
   ]}`)
}, {
  dependsOn: [bucket],
});

// Attach the policy to the role
const lambdaS3PolicyAttachment = new aws.iam.PolicyAttachment("lambda-s3-policy-attachment", {
    policyArn: lambdaS3Policy.arn,
    roles: [role],
}, {
    dependsOn: [lambdaS3Policy],
});


const lambda = new aws.lambda.Function(
    `${appName}-lambda-edge`,
    {
        role: role.arn,
        runtime: "nodejs12.x",
        handler: "index_lambda.lambdaHandler",
        code: new pulumi.asset.AssetArchive({
            ".": new pulumi.asset.FileArchive("../dist/src/"),
            "node_modules": new pulumi.asset.FileArchive("../lambda/node_modules"),
            "static": new pulumi.asset.FileArchive("../static"),
            "fonts": new pulumi.asset.FileArchive("../fonts"),
        }),
        memorySize: 128,
        timeout: 30,
        publish: true,
    }
    , { dependsOn: [rolePolicy] }
);

// create a new cloudfront distribution using the s3 bucket as the origin
const cdn = new aws.cloudfront.Distribution("og-img-distribution", {
    aliases: distributionAliases,
    defaultCacheBehavior: {
        allowedMethods: [
            "GET",
            "HEAD",
        ],
        cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
        cachedMethods: [
            "GET",
            "HEAD",
        ],
        compress: true,
        targetOriginId: "og-image-generator-assets-ccc0160.s3.us-east-1.amazonaws.com",
        viewerProtocolPolicy: "allow-all",
        lambdaFunctionAssociations: [
            {
                eventType: "origin-response",
                lambdaArn: lambda.arn.apply(arn => `${arn}:18`),
                includeBody: false,
            }
        ],
    },
    
    enabled: true,
    isIpv6Enabled: true,
    origins: [{
        domainName: "og-image-generator-assets-ccc0160.s3.us-east-1.amazonaws.com",
        originAccessControlId: "E3KYTKMKDH21LY",
        originId: "og-image-generator-assets-ccc0160.s3.us-east-1.amazonaws.com",
    }],
    priceClass: "PriceClass_200",
    restrictions: {
        geoRestriction: {
            restrictionType: "none",
        },
    },
    viewerCertificate: {
        acmCertificateArn: certificateArn,
        sslSupportMethod: "sni-only",
    },
}, {
    protect: true,
    dependsOn: [lambda],
}
);

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
function getDomainAndSubdomain(domain: string): { subdomain: string, parentDomain: string } {
    const parts = domain.split(".");
    if (parts.length < 2) {
        throw new Error(`No TLD found on ${domain}`);
    }
    // No subdomain, e.g. awesome-website.com.
    if (parts.length === 2) {
        return { subdomain: "", parentDomain: domain };
    }

    const subdomain = parts[0];
    parts.shift();  // Drop first element.
    return {
        subdomain,
        // Trailing "." to canonicalize domain.
        parentDomain: parts.join(".") + ".",
    };
}


// Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
function createAliasRecord(
    targetDomain: string, distribution: aws.cloudfront.Distribution): aws.route53.Record {
    const domainParts = getDomainAndSubdomain(targetDomain);
    const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);
    return new aws.route53.Record(
        targetDomain,
        {
            name: domainParts.subdomain,
            zoneId: hostedZoneId,
            type: "A",
            aliases: [
                {
                    name: distribution.domainName,
                    zoneId: distribution.hostedZoneId,
                    evaluateTargetHealth: true,
                },
            ],
        });
}

function createWWWAliasRecord(targetDomain: string, distribution: aws.cloudfront.Distribution): aws.route53.Record {
    const domainParts = getDomainAndSubdomain(targetDomain);
    const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);

    return new aws.route53.Record(
        `${targetDomain}-www-alias`,
        {
            name: `www.${targetDomain}`,
            zoneId: hostedZoneId,
            type: "A",
            aliases: [  
                {
                    name: distribution.domainName,
                    zoneId: distribution.hostedZoneId,
                    evaluateTargetHealth: true,
                },
            ],
        },
    );
}

const aRecord = createAliasRecord(config.targetDomain, cdn);
if (config.includeWWW) {
    const cnameRecord = createWWWAliasRecord(config.targetDomain, cdn);
}



const lambdaPermission = new aws.lambda.Permission(
    `${appName}-lambda-edge-permission`,
    {
        action: "lambda:InvokeFunction",
        function: lambda.arn,
        principal: "edgelambda.amazonaws.com",
        sourceArn: cdn.arn
    }
    , { dependsOn: [lambda] }
);


export const cloudFrontDomain = cdn.domainName;
export const targetDomainEndpoint = `https://${config.targetDomain}/`;