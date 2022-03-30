set curPath=%~dp0
pushd %curPath%
:数据目录
set data_path=%curPath%game\data
set export_path=%curPath%game\export
:项目目录
set copy_path=%curPath%assets\resources\data

node read_all.js game %data_path%  %export_path%
popd
pause