@echo off
setlocal enabledelayedexpansion

rem ����1���������������ϷĿ¼��(����Ҫ����һ��!!!)  ����2 ���µİ汾�� ����3 ���°����ص�ַ  ����4 manifest���ص�ַ

rem ��������Ϸͨ�õ����ص�ַ
set URL_PACKAGE="http://ss.quanziyou.com/update_new/package_update/"
set URL_MANIFEST="http://ss.quanziyou.com/update_new/package_update/"

echo "������������Ϸ���°���ʼ"
call subgame_update.bat "BaZhouMJ" "0.0.4" %URL_PACKAGE% %URL_MANIFEST%
rem call subgame_update.bat "KuanChengMJ" "0.0.2" %URL_PACKAGE% %URL_MANIFEST%
rem call subgame_update.bat "PingQuanMJ" "0.0.2" %URL_PACKAGE% %URL_MANIFEST%
call subgame_update.bat "TuiDaoHuMJ" "0.0.5" %URL_PACKAGE% %URL_MANIFEST%
rem ������ call subgame_update.bat "DouDiZhu" "0.0.3" %URL_PACKAGE% %URL_MANIFEST% 

echo "������������Ϸ���°�����"

pause