## If you are running this on mac and you need to deploy it to lambda then run the following command

[]: # npm install
[]: # rm -rf node_modules/sharp
[]: # SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux --libc=glibc sharp
