export module LangDef {

	//游戏中用到的语言列表
	export const LANGNAMES = {
		"zh-CN" : "zh", //中文简体
		"zh-TW" : "tw", //中文繁体
		"en-US" : "en", //英语
		"ja-JP" : "jp", //日语
		"id-ID" : "id", //印尼语
		"vi-VN" : "vn", //越南语
		"ar-EG" : "eg", //阿拉伯语
	}

	export const LOCAL_LANGNAME = "game_langname" //本地保存的当前使用的哪种语言

	//多语言中用到的消息通知事件
    export const EVENTS = {
		CHANGE_LANG: "notify_change_lang",//切换大厅多语言
		CHANGE_BD_LANG: "notify_change_bundle_lang",//切换子游戏多语言
	}
	
	export const LANG_LOAD_OK = 0 //语言文件加载成功
	export const LANG_LOAD_FAIL = 1 //语言文件加载失败
	export const LANG_ENCODE_LOAD_FAIL = 2 //多语言加密文件加载失败


	

	//========游戏大厅用到的多语言配置数据==========

	//大厅
	export const LANG_JSONNAME = "dating"
	export const LANG_TABLENAME = "dating_data"
}

