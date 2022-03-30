@echo off
setlocal enabledelayedexpansion
rem �汾�������������������Ҫ�޸ģ�������
set gamename="game786"
set platform="app"
set version=""
set /p appgames=<subgame_inapp.txt
rem downloadurl ���ظ��°���ַ url��ȡmanifest��ַ
set downloadurl="http://ss.quanziyou.com/update_new/package_update/"
set url="http://ss.quanziyou.com/update_new/package_update/"

set curPath=%~dp0
pushd %curPath%

echo "��ȡ�汾�š�
cd /d %curPath%\assets
set tmpjson=""
for /f "tokens=1,2* delims=," %%a in ('type game_version.json ^| findstr "%platform%"') do (
    set tmpjson=%%a
)
rem echo  tmpjson:%tmpjson%
rem tokens=1*��tokens��ʾ�ֶεķ�ʽ��tokens=1*��ʾ��һ���ָ���;֮ǰ����Ϊһ����,ʣ�µ�(*��ʾ)��Ϊһ���֡�����������ѭ�����ܿ�����%%a��ʾ��һ���֣�%%b��ʾ�ڶ����֡�
for /f "tokens=1* delims=:" %%a in ("%tmpjson%") do (
	set version=%%b
)
echo ��ǰ�汾��: %version%

echo "��ȡ��������Ϸ�б�: %appgames%

cd /d %curPath%

echo "ɾ��manifestĿ¼"
rd /s /q %curPath%manifest

echo "����manifest"
node version_generator.js -inapp %appgames% -v %version% -dl %downloadurl% -u %url%  -s build/jsb-default/ -d manifest/ 

echo "ɾ��package_updateĿ¼"
rd /s /q %curPath%package_update

echo "�ƶ�manifest��package_update"
xcopy /s /e /y /i %curPath%manifest\*.manifest %curPath%package_update

echo "�ƶ�res��src��package_update"
xcopy /s /e /y /i %curPath%build\jsb-default\assets\internal %curPath%package_update\assets\internal
xcopy /s /e /y /i %curPath%build\jsb-default\assets\main %curPath%package_update\assets\main
xcopy /s /e /y /i %curPath%build\jsb-default\assets\resources %curPath%package_update\assets\resources
xcopy /s /e /y /i %curPath%build\jsb-default\src %curPath%package_update\src

echo "�ƶ�����bundle��Դ"
xcopy /s /e /y /i %curPath%build\jsb-default\assets\DouDiZhu %curPath%package_update\assets\DouDiZhu

echo "ѹ��package_update����Դ"
cd /d %curPath%package_update
set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%
set "timestamp=%timestamp: =0%"
echo %timestamp%
7z a -ttar package_update.tar *
7z a -tgzip %gamename%_update_%version%_%timestamp%.tar.gz package_update.tar
del /q package_update.tar
echo "���°����ɳɹ�"

cd /d %curPath%
xcopy /s /e /y /i %curPath%build\jsb-default\"js backups (useful for debugging)" %curPath%js_backup

echo "����ű����ݳɹ�"
popd