export module MainDef {
	//大厅控制的常量都在这里定义

	//游戏中的各种带脚本的节点宏定义
	export const WINS = {
		//MENU: { fabname: "layer_menu", fabscp: "WinMenu", notify: "notify_event_menu" },//斗地主UI界面
		SIGN7: { fabname: "infos_signin", fabscp: "WinSignin", notify: "notify_event_main_sign7" },//7天签到
		ACT: { fabname: "infos_activity", fabscp: "WinAct", notify: "notify_event_main_act" },//活动弹板
		SHITU: { fabname: "infos_shitu", fabscp: "WinShiTu", notify: "notify_event_main_shitu" },//师徒
		TDHMENU: { fabname: "", fabscp: "WinTDHMenu", notify: "notify_event_tdhmenu" },//斗地主UI界面
		JOIN: { fabname: "infos_join", fabscp: "WinJoin", notify: "notify_event_main_join" },//加入房间
		MAIL: { fabname: "infos_mail", fabscp: "WinMail", notify: "notify_event_main_mail" },//邮件
		RECORD: { fabname: "infos_record", fabscp: "WinRecord", notify: "notify_event_main_record" },//战绩
		AGENTJOIN: { fabname: "", fabscp: "WinAgentJoin", notify: "notify_event_main_agentjoin" },//代理加盟
		PLAYERINFO: { fabname: "layer_playerinfo", fabscp: "WinPlayerInfo", notify: "notify_event_main_playerinfo" },//玩家信息
		TEA_MAIN: { fabname: "", fabscp: "Tea_Main", notify: "notify_event_tea_ruleset" },//茶馆
		KEFU: { fabname: "infos_service", fabscp: "WinService", notify: "notify_event_main_kefu" },//客服
		BINDPHONE: { fabname: "infos_bind", fabscp: "WinBindPhone", notify: "notify_event_main_bindphone" },//绑定手机
		FRIEND: { fabname: "layer_friend", fabscp: "WinFriend", notify: "notify_event_main_friend" },//好友场
		RANK: { fabname: "infos_rank", fabscp: "WinRank", notify: "notify_event_main_rank" },//排行榜
		MISSION: { fabname: "infos_mission", fabscp: "WinMission", notify: "notify_event_main_mission" },//任务
		GUIDE: { fabname: "layer_guide", fabscp: "layer_guide", notify: "notify_event_main_guide" },//玩法
		MORE: { fabname: "layer_more", fabscp: "WinMore", notify: "notify_event_main_more" },//更多游戏
		REAL: { fabname: "infos_real", fabscp: "WinReal", notify: "notify_event_main_real" },//更多游戏
		POSITION: { fabname: "infos_position", fabscp: "WinPosition", notify: "notify_event_main_position" },//定位
		BOX: { fabname: "infos_box", fabscp: "WinBox", notify: "notify_event_main_box" },//定位
		EXCHANGE: { fabname: "infos_exchange", fabscp: "WinExchange", notify: "notify_event_main_exchange" },//兑换
		ORDER: { fabname: "layer_order", fabscp: "WinOrder", notify: "notify_event_main_order", shownotify: "notify_refersh_addaddress" },//订单
		ADDADDRESS: { fabname: "info_addAddress", fabscp: "WinAddAddress", notify: "notify_event_main_addaddress" },//添加地址
		ZENGSONG: { fabname: "info_zengsong", fabscp: "WinZengSong", notify: "notify_event_main_zengsong" },//赠送
		WITHDRAWAL: { fabname: "infos_withdrawal", fabscp: "WinWithdrawal", notify: "notify_event_main_withdrawal" },//自提核销
		LOGISTICS: { fabname: "infos_logistics", fabscp: "WinLogistics", notify: "notify_event_main_logistics" },//物流
		HUAFEI: { fabname: "layer_huafei", fabscp: "WinHuaFei", notify: "notify_event_main_lhuafei" },//话费

	}
	export const MATCH = {
		ARENA: { fabname: "infos_matcharena", fabscp: "WinMatchArena", notify: "notify_event_match_arena" },
		GOLD: { fabname: "infos_matchgold", fabscp: "WinMatchGold", notify: "notify_event_match_gold" }
	}



	//弹板对应的消息通知事件
	export const EVENTS = {
		NOTIFY_REF_MAIN_HEADINFO: "notify_event_main_headinfo", //刷新主界面玩家信息
		NOTIFY_REF_IMGURI: "notify_event_main_ref_imguri",
	}


	export const ORDER_CREATE = 0;// 订单待付款
	export const ORDER_PAY = 1;// 订单已支付(待发货)
	export const ORDER_PENDING_DELIVERY = 2;// 订单备货中
	export const ORDER_DELIVERY = 3;// 订单已发货（配货）
	export const ORDER_TAKE_DELIVERY = 4;// 订单已收货
	export const ORDER_COMPLETE = 10;// 订单已结算完成
	export const ORDER_CLOSE = -1;// 订单已关闭



}


