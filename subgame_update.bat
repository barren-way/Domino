@echo off
setlocal enabledelayedexpansion
rem 版本号如果有提升，这里需要修改！！！！
rem gamename 子游戏的目录名称
rem downloadurl 下载更新包地址 url获取manifest地址
set gamename=%1
set version=%2
set downloadurl=%3
set url=%4

echo.&call echo ===================================================
echo 开始打包子游戏：!gamename! 版本号：!version!

set curPath=%~dp0
pushd %curPath%

if not exist %curPath%manifest_sub/ md %curPath%manifest_sub
if not exist %curPath%package_update_sub md %curPath%package_update_sub

echo 删除manifest_sub下的!gamename! 目录
rd /s /q %curPath%manifest_sub\%gamename%

echo "生成manifest"
node version_generator_bundle.js -b %gamename% -v %version% -dl %downloadurl% -u %url% -s build/jsb-default/assets/ -d manifest_sub/%gamename%

echo 删除package_update_sub下的!gamename! 目录
rd /s /q %curPath%package_update_sub\%gamename%

echo 移动manifest到package_update_sub下的!gamename! 目录
xcopy /s /e /y /i %curPath%manifest_sub\%gamename%\*.manifest %curPath%package_update_sub\%gamename%\

echo 移动子游戏下的目录到package_update_sub下的!gamename!目录
xcopy /s /e /k /i %curPath%build\jsb-default\assets\%gamename%\*.*  %curPath%package_update_sub\%gamename%\

echo 压缩package_update_sub下的!gamename!目录资源
cd /d %curPath%package_update_sub/%gamename%
set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%
set "timestamp=%timestamp: =0%"
echo %timestamp%
7z a -ttar package_update.tar *
7z a -tgzip %gamename%_update_%version%_%timestamp%.tar.gz package_update.tar
del /q package_update.tar
xcopy /s /k /i %curPath%package_update_sub\%gamename%\*.tar.gz %curPath%package_update_sub_export
echo !gamename!更新包生成成功

cd /d %curPath%
xcopy /s /k /y /i %curPath%build\jsb-default\"js backups (useful for debugging)"\%gamename%.index.js %curPath%js_backup\%gamename%.index.js

echo !gamename!编译脚本备份成功
popd