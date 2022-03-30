@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0
set name="game786_sig"
pushd %curPath%
echo "gen keystore"
keytool -genkey -keypass 123456 -storepass 123456 -dname "CN=1,OU=1,O=1,L=1,ST=1,C=1" -alias %name% -keyalg RSA -validity 40000 -keystore %name%.keystore
cd /d %curPath%
popd