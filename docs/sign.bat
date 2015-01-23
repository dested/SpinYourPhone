jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release.keystore c:\code\SpinYourPhone\src\platforms\android\ant-build\CordovaApp-release-unsigned.apk spinYourPhone


C:\Users\deste_000\AppData\Local\Android\android-sdk\build-tools\21.1.2\zipalign.exe -v 4 c:\code\SpinYourPhone\src\platforms\android\ant-build\CordovaApp-release-unsigned.apk SpinYourPhone.apk