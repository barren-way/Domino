@echo off
setlocal enabledelayedexpansion

rem 参数1：工程里面的子游戏目录名(必须要保持一致!!!)  参数2 更新的版本号 参数3 更新包下载地址  参数4 manifest下载地址

rem 设置子游戏通用的下载地址
set URL_PACKAGE="http://ss.quanziyou.com/update_new/package_update/"
set URL_MANIFEST="http://ss.quanziyou.com/update_new/package_update/"

echo "批量生成子游戏更新包开始"
call subgame_update.bat "BaZhouMJ" "0.0.4" %URL_PACKAGE% %URL_MANIFEST%
rem call subgame_update.bat "KuanChengMJ" "0.0.2" %URL_PACKAGE% %URL_MANIFEST%
rem call subgame_update.bat "PingQuanMJ" "0.0.2" %URL_PACKAGE% %URL_MANIFEST%
call subgame_update.bat "TuiDaoHuMJ" "0.0.5" %URL_PACKAGE% %URL_MANIFEST%
rem 已内置 call subgame_update.bat "DouDiZhu" "0.0.3" %URL_PACKAGE% %URL_MANIFEST% 

echo "批量生成子游戏更新包结束"

pause