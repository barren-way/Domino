@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0
set name="game786_sig"
pushd %curPath%
echo "look keystore"
keytool -list -v -keystore %name%.keystore -keypass 123456 -storepass 123456
cd /d %curPath%
popd
pause