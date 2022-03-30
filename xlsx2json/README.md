# xlsx

#### 工具介绍
项目开发中使用的xlsx配置文件解析工具
1. 通过表头设置导出的文件名
2. 支持将多个sheet导出为一个文件，减少网络请求次数。
3. 不管语言文本在哪个文件的哪个表中都会导出到一个文件中，方便多语言处理
4. 所有语言文本都会导出到一个txt文件中，方便制作bmfont字体。
5. 使用base64zh 编码
6. 使用枚举索引数据，减少数据量
7. 根据数据表的结构导出类文件
8. 支持Creator插件使用方式和命令行方式

#### 环境配置
1. 安装Nodejs
2. 安装node-xlsx（暂时不用，工具里面会默认带上）
npm install node-xlsx --save-dev 

#### 表头说明
1. 用文件中的第一个sheet作为整体说明，此sheet只有一列数据，从第二行开始标识之后每个sheet导出时使用的名字，拼音或者英文都可。
2. 第一行如果填了内容(非null)说明此后所有sheet中的数据将导出到一个文件中，文件名为第一行的内容，这样可以降低加载文件时的请求次数。
3. 如果第一行没有内容，填写null，则每个sheet将单独导出为一个文件。

#### 表内说明
1. 前四行为说明，之后为数据。
2. 第一行为每列数据的注释，说明这列数据的用途,不会导出。
3. 第二行为此列数据的程序中使用的名字。
4. 第三行为此列数据的类型。
5. 第四行为客户端和服务器导出信息。预留，一般默认填C即可(C代表客户端，S代表服务器)

#### 支持的类型
1. 整型：i
2. 浮点型: f 
3. 一维数组 [i]  eg: 4,5
4. 二维数组 [[i]] eg: 4,5|5,6
5. 三维数组 [[[i]]]  待支持
6. 字符串： s 
7. lang：代表字符串，此列会导入到一个语言表中，如果不想导入到语言表中可以设置成s。
8. 任意类型：any
9. 索引列：index；支持多索引形式
10. null：标识此列不输出

#### 使用方式
1. 双击**导出中文数据.bat**文件即可,会默认导出中文json文件game_lang_zh.json。
2. 如果要导出其他语言文件，使用**导出多语言数据.bat**导出即可，会生成对应的json文件，然后把json文件丢给策划翻译就行。
3. 如果excel里面新增了需要翻译的中文，也需要先执行**导出中文数据.bat**,然后再执行**导出多语言数据.bat**
4. json翻译可以使用**https://www.sojson.com/**进行修改，修改完后，点击压缩重新导出一份新的json文件并提交
