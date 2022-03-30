@echo off
setlocal enabledelayedexpansion
set curPath=%~dp0
pushd %curPath%
:数据导出目录
set export_path=%curPath%game\export

echo 执行导出多语言脚本前确保已导出中文json文件！！！！
echo 0.全部 1.英语 2.俄语 3.法语
set lang[0]=all
set lang[1]=en
set lang[2]=rs
set lang[3]=fr

set /p choice=请选择要导出的语言：

for /l %%i in (0,1,3) do (
     if "%choice%" == "0" (
     	if ”%%i“ GTR ”0“ (
     	 	echo 导出语言: !lang[%%i]!
     	 	node export_lang.js game %export_path%\ !lang[%%i]!
     	)
     ) else (
     	if "%choice%" == "%%i" (
	     	echo 导出语言: !lang[%choice%]!
			node export_lang.js game %export_path%\ !lang[%choice%]!
			goto end
     	)
     )
)

:end

echo 导出成功！！

pause