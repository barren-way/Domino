export module DominoDef {
	//大厅控制的常量都在这里定义

	export const MATCH = {
		ARENA: { fabname: "infos_matcharena", fabscp: "WinMatchArena", notify: "notify_event_match_arena" },
		GOLD: { fabname: "infos_matchgold", fabscp: "WinMatchGold", notify: "notify_event_match_gold" }
	}

	//弹板对应的消息通知事件
	export const EVENTS = {
		NOTIFY_REF_MAIN_HEADINFO: "notify_event_main_headinfo", //刷新主界面玩家信息
		NOTIFY_REF_IMGURI: "notify_event_main_ref_imguri",
	}

	//游戏中的各种带脚本的节点宏定义
	export const enum WINS {
        GAME_RESULT,
        GAME_OVER,
	}

	export const SCRIPTS = [
        "BZMaJiangGame_Result",
        "BZMaJiangGame_Over",
    ]

	export const ORDER_CREATE = 0;// 订单待付款
	export const ORDER_PAY = 1;// 订单已支付(待发货)
	export const ORDER_PENDING_DELIVERY = 2;// 订单备货中
	export const ORDER_DELIVERY = 3;// 订单已发货（配货）
	export const ORDER_TAKE_DELIVERY = 4;// 订单已收货
	export const ORDER_COMPLETE = 10;// 订单已结算完成
	export const ORDER_CLOSE = -1;// 订单已关闭

	export const MSGTYPE_GAME = 0 //朋友桌
    export const MSGTYPE_MATCH = 1 //淘汰赛
	export const MSGTYPE_TRAINMATCH = 2 //训练赛
	
	//======================多语言相关

	//多语言数据文件名前缀 xx_info.json, xx_lang_en.json
	export const LANG_JSONNAME = "game"
	export const LANG_TABLENAME = "ui_data"
	
	export enum Ui_dataEnum {
		content,// 文本内容

	}

}


