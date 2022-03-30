@echo off
setlocal enabledelayedexpansion
rem 版本号如果有提升，这里需要修改！！！！
set gamename="game786"
set platform="app"
set version=""
set /p appgames=<subgame_inapp.txt
rem downloadurl 下载更新包地址 url获取manifest地址
set downloadurl="http://ss.quanziyou.com/update_new/package_update/"
set url="http://ss.quanziyou.com/update_new/package_update/"

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

echo "读取内置子游戏列表: %appgames%

cd /d %curPath%

echo "删除manifest目录"
rd /s /q %curPath%manifest

echo "生成manifest"
node version_generator.js -inapp %appgames% -v %version% -dl %downloadurl% -u %url%  -s build/jsb-default/ -d manifest/ 

echo "删除package_update目录"
rd /s /q %curPath%package_update

echo "移动manifest到package_update"
xcopy /s /e /y /i %curPath%manifest\*.manifest %curPath%package_update

echo "移动res和src到package_update"
xcopy /s /e /y /i %curPath%build\jsb-default\assets\internal %curPath%package_update\assets\internal
xcopy /s /e /y /i %curPath%build\jsb-default\assets\main %curPath%package_update\assets\main
xcopy /s /e /y /i %curPath%build\jsb-default\assets\resources %curPath%package_update\assets\resources
xcopy /s /e /y /i %curPath%build\jsb-default\src %curPath%package_update\src

echo "移动内置bundle资源"
xcopy /s /e /y /i %curPath%build\jsb-default\assets\DouDiZhu %curPath%package_update\assets\DouDiZhu

echo "压缩package_update的资源"
cd /d %curPath%package_update
set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%
set "timestamp=%timestamp: =0%"
echo %timestamp%
7z a -ttar package_update.tar *
7z a -tgzip %gamename%_update_%version%_%timestamp%.tar.gz package_update.tar
del /q package_update.tar
echo "更新包生成成功"

cd /d %curPath%
xcopy /s /e /y /i %curPath%build\jsb-default\"js backups (useful for debugging)" %curPath%js_backup

echo "编译脚本备份成功"
popd