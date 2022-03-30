@echo off
setlocal ENABLEDELAYEDEXPANSION
rem 需要配置unxutils到系统环境变量第一个，并重启电脑生效！！！
rem 打全量包时踢除需要下载的子游戏，只保留内置子游戏！！！！
echo "!!!!!!踢除子游戏开始!!!!!!!!!"
SET curPath=%~dp0
SET SUBGAMELIST=subgame_inapp.txt
SET TARGETDIR=%curPath%build\jsb-default\assets

SET COMMAND=find %TARGETDIR% -mindepth 1 -maxdepth 1 -type d -not -name "internal" -a -not -name "main" -a -not -name "resources"
for /f "tokens=*" %%a in ('cat %SUBGAMELIST%^|tr -d " "^|tr "," "\n"') do (	SET COMMAND=!COMMAND! -a -not -name "%%a" )
SET COMMAND=!COMMAND! -exec rm -r {} ;
%COMMAND%
setlocal DISABLEDELAYEDEXPANSION

echo "!!!!!!踢除子游戏结束!!!!!!!!!"
pause