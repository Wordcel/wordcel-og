export const ProfileOG = (
  name: string,
  username: string,
  bio: string,
  image: string
) => {
  let bioFirstSection = '';
  let bioSecondSection = '';
  const words = bio.split(' ');
  const extra = words.length > 11;
  bioFirstSection = words.slice(0, 6).join(' ');
  bioSecondSection = words.slice(6, 12).join(' ');

  return (
    `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g clip-path="url(#clip0_5_6515)">
    <rect width="1200" height="630" fill="white"/>
    <g clip-path="url(#clip1_5_6515)">
    <path d="M0 0H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 53H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 106H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 159H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 212H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M52.875 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M105.75 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M158.625 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M211.5 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M264.375 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M317.25 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M370.125 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 0V212" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip2_5_6515)">
    <path d="M423 0H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 53H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 106H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 159H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 212H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M475.875 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M528.75 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M581.625 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M634.5 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M687.375 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M740.25 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M793.125 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M846 0V212" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip3_5_6515)">
    <path d="M844 0H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 53H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 106H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 159H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 212H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M896.875 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M949.75 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1002.62 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1055.5 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1108.38 0V212" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1161.25 0V212" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip4_5_6515)">
    <path d="M0 212H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 265H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 318H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 371H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 424H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M52.875 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M105.75 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M158.625 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M211.5 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M264.375 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M317.25 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M370.125 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 212V424" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip5_5_6515)">
    <path d="M423 212H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 265H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 318H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 371H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 424H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M475.875 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M528.75 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M581.625 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M634.5 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M687.375 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M740.25 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M793.125 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M846 212V424" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip6_5_6515)">
    <path d="M844 212H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 265H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 318H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 371H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 424H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M896.875 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M949.75 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1002.62 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1055.5 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1108.38 212V424" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1161.25 212V424" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip7_5_6515)">
    <path d="M0 424H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 477H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 530H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 583H423" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M0 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M52.875 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M105.75 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M158.625 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M211.5 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M264.375 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M317.25 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M370.125 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 424V636" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip8_5_6515)">
    <path d="M423 424H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 477H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 530H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 583H846" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M423 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M475.875 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M528.75 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M581.625 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M634.5 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M687.375 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M740.25 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M793.125 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M846 424V636" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <g clip-path="url(#clip9_5_6515)">
    <path d="M844 424H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 477H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 530H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 583H1267" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M844 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M896.875 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M949.75 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1002.62 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1055.5 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1108.38 424V636" stroke="#F1F1F1" stroke-width="2"/>
    <path d="M1161.25 424V636" stroke="#F1F1F1" stroke-width="2"/>
    </g>
    <rect x="106" y="91" width="989" height="439" fill="white"/>
    <text fill="black" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="55" font-weight="bold" letter-spacing="0em"><tspan x="465" y="250.5">${
      name.length > 20 ? name.substring(0, 20) + '...' : name
    }</tspan></text>
    <text fill="#8497A5" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="31" font-weight="500" letter-spacing="0em"><tspan x="465" y="306.273">@${username}</tspan></text>
    <rect x="465" y="174" width="75" height="11" fill="#2395FF"/>
    <text fill="#434343" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="29" letter-spacing="0em">
      <tspan x="465" y="380.045">${bioFirstSection}</tspan>
      <tspan x="465" y="415.045">${extra ? bioSecondSection + '...' : bioSecondSection}</tspan>
    </text>
    <rect x="159" y="169" width="253" height="253" rx="16" fill="url(#pattern0)"/>
    </g>
    <defs>
    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
    <use xlink:href="#image0_5_6515" transform="scale(0.005)"/>
    </pattern>
    <clipPath id="clip0_5_6515">
    <rect width="1200" height="630" fill="white"/>
    </clipPath>
    <clipPath id="clip1_5_6515">
    <rect width="423" height="212" fill="white"/>
    </clipPath>
    <clipPath id="clip2_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(423)"/>
    </clipPath>
    <clipPath id="clip3_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(844)"/>
    </clipPath>
    <clipPath id="clip4_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(0 212)"/>
    </clipPath>
    <clipPath id="clip5_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(423 212)"/>
    </clipPath>
    <clipPath id="clip6_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(844 212)"/>
    </clipPath>
    <clipPath id="clip7_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(0 424)"/>
    </clipPath>
    <clipPath id="clip8_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(423 424)"/>
    </clipPath>
    <clipPath id="clip9_5_6515">
    <rect width="423" height="212" fill="white" transform="translate(844 424)"/>
    </clipPath>
    <image id="image0_5_6515" width="200" height="200" xlink:href="${image}"/>
    </defs>
    </svg>
    `
  )
};
