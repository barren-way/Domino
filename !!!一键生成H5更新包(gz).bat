@echo off
setlocal enabledelayedexpansion
rem 版本号如果有提升，这里需要修改！！！！
set gamename="game786"
set platform="webgame"
set version=""
set htmlname=""
set curPath=%~dp0
pushd %curPath%

echo "读取版本号“
cd /d %curPath%\assets
set tmpjson=""
for /f "tokens=1,2* delims=," %%a in ('type game_version.json ^| findstr "%platform%"') do (
    set tmpjson=%%a
)
rem echo  tmpjson:%tmpjson%
rem tokens=1*，tokens表示分段的方式，tokens=1*表示第一个分隔符;之前的作为一部分,剩下的(*表示)作为一部分。这两部分在循环体总可以用%%a表示第一部分，%%b表示第二部分。
for /f "tokens=1* delims=:" %%a in ("%tmpjson%") do (
	set version=%%b
)
echo 当前版本号: %version%

cd /d %curPath%
echo "删除旧的H5更新包"
rem if exist %gamename%_%platform%_*.gz del  %gamename%_%platform%_*.gz
if exist web-mobile.tar del web-mobile.tar

set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%
set "timestamp=%timestamp: =0%"
echo %timestamp%
set htmlname=game%timestamp%

echo "修改web-mobile里面的文件名"
cd /d %curPath%build\web-mobile
ren index.html %htmlname%.html
cd /d %curPath%

echo "压缩web-mobile里面的更新资源"
7z a -ttar web-mobile.tar %curPath%build\web-mobile\*
7z a -tgzip %gamename%_%platform%_%version%_%timestamp%.tar.gz web-mobile.tar

echo "H5更新包生成成功"
if exist web-mobile.* del web-mobile.*
if exist web-mobile.tar del web-mobile.tar

echo "恢复html文件名"
cd /d %curPath%build\web-mobile
ren %htmlname%.html index.html

cd /d %curPath%
popd
pause
