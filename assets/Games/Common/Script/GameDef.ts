export module GameDef {
    //全局控制的常量都在这里定义
    export const APP_GAMEID = 1006; //APP的gameid(现在默认都是1006，以后可能会变动)

    //显示FPS和drawcall相关信息
    export const SHOW_DEBUG = false

    /**
     * 各个游戏对应的id和名称
     * 如果是bundle，需要多加两个参数，bdname: bundle的目录包名 autorelease:bundle退出时是否删除所有资源
     * bdname 如果设置成了bundle就填，否则不需要填
     * autorelease 0表示退出bundle时不删除资源，1表示退出时删除bundle中的所有资源
     * inapp 1表示是内置bundle 
     */
    export const GNAMES = {
        //老虎机
        "101": { gamename: "laohuji", bdname: "LaoHuJi", scname: "LaoHuJiUI", cnname: "老虎机", autorelease: 1, inapp: 1},
        "Dian21": { gamename: "black_jack", bdname: "Dian21", scname: "Dian21UI", cnname: "21点", autorelease: 1, inapp: 1},
        "domino": { gamename: "domino", bdname: "Domino", scname: "DominoUI", cnname: "多米诺", autorelease: 1, inapp: 1},
    }

    export const GIDS = {
        laohuji: "101",
        black_jack: "Dian21",
        domino: "domino",
    }

    export const GOPENS = {

    }


    //场景UI名称
    export const startScene: string = "LoginUI" //初始登录场景
    export const mainScene: string = "MainUI" //游戏大厅场景
    export const teaScene: string = "TeaUI" //茶馆场景
    export const matchpreScene: string = "MatchPreUI" //比赛报名场景

    //本地存储的macid
    export const LOCAL_MACID_KEY = "game_local_macid"
    //本地存储的资源版本号
    export const LOCAL_VERSION_KEY = "game_local_version"
    //本地存储的热更地址
    export const LOCAL_UPDATEURL_KEY = "game_local_updateurl"
    //本地存储的子游戏热更版本
    export const LOCAL_SUBGAME_VERSION = "game_local_subgame_version"


    export const AUTOFULLSCREEN = "game_auto_fullscreen" //自动全屏保存的标志

    export const GAME_AGREEMENT_FLAG = "game_agreement_flag" //游戏协议同意
    export const AUTOLOGIN_TYPENAME = "game_autologin_type" //自动登录保存的类型
    export const AUTOLOGIN_TELNUM = "game_autologin_telnum" //自动登录保存的手机号
    export const LOCAL_TOKEN = "userToken"       //本地保存token
    export const LOCAL_TOKENTIME = "timeToken"       //本地保存token
    export const LOCAL_WXCODE = "userWxCode"       //本地保存的微信code
    export const LOCAL_TOKENSAVE = 30       //本地保存的微信code

    export const LOCAL_FIRSTSIGIN = "firstlogin"       //本地保存token

    export const LOGIN_TYPENAME = "login_type"
    export const LOGIN_GUEST = 0; //游客登录
    export const LOGIN_WX = 1; //微信登录
    export const LOGIN_TEL = 2; //手机登录
    export const LOGIN_MW = 3; //默往登录

    export const PROP_BASE = 1 //基础属性
    export const PROP_ITEM = 2 //道具
    export const PROP_ENTIRY = 3 //自己实物
    export const PROP_MENPIAO = 4 //门票
    export const PROP_LCENTIRY = 5 //乐聪实物
    export const PROP_LCHUAFEE = 6 //乐聪话费

    //异步加载等待时间
    export const ASYNC_TIME = 0

    //游戏中常用的货币
    export const ATT_NAMES = { 1: "gold", 2: "roomcard", 3: "matchticket" }
    export const ATT_NAMESKV = { gold: 1, roomcard: 2, matchticket: 3 }
    export const ATT_NAMECN = { 1: "金币", 2: "钻石", 3: "兑换券" }


    //商城购买类型
    export const BUYTYPE_ROOMCARD = 1 //购买钻石
    export const BUYTYPE_HUAFEI = 2 //话费兑换
    export const BUYTYPE_GOODS = 3 //购买商品实物
    export const BUYTYPE_EXCHANGE = 4 //钻石金币互换
    export const BUYTYPE_VIP = 5 //钻石金币互换s
    export const BUYTYPE_GOLD = 6 //购买金币


    export const SEX_MAN = 1 //男性
    export const SEX_WOMAN = 2 //女性

    //键盘弹出类型
    export const KEYBOARD_TYPE_NUM = 1 //数字键盘
    export const KEYBOARD_TYPE_ABC = 2 //数字+字母键盘

    //输入类型
    export const INPUT_TYPE_TEL = 1 //输入手机号
    export const INPUT_TYPE_PASS = 2 //输入密码
    export const INPUT_TYPE_SMSCODE = 3 //输入验证码
    export const INPUT_TYPE_OTHER = 4 //其他输入类型

    //输入内容
    export const INPUT_STR_TEL = "请输入手机号"
    export const INPUT_STR_PASS = "请输入密码"
    export const INPUT_STR_PASSQR = "请确认密码"
    export const INPUT_STR_SMSCODE = "请输入验证码"
    export const INPUT_STR_GETCODE = "获取验证码"
    export const INPUT_STR_INVITE = "请输入邀请码"
    export const INPUT_STR_RECORD = "请输入录像码"

    //游戏中的各种带脚本的节点宏定义
    export const enum WINS {

    }

    //弹板对应的脚本
    export const SCRIPTS = [

    ]

    //全局通用的消息通知事件
    export const EVENTS = {
        NOTIFY_REF_USERINFO: "refUserInfo",//刷新用户货币数据
        NOTIFY_REF_USERINFO_ADD: "hideUserAddIcon",//隐藏货币上的加号
        NOTIFY_FULLSCREEN: "fullscreenchange",//切换到全屏
        NOTIFY_IP_REF: "notify_event_ip_ref",//刷新ip提醒弹板
        NOTIFY_GPS_REF: "notify_event_gps_ref",
        NOTIFY_DISMISS_REF: "notify_event_dismiss_ref", //实时刷新数据
        NOTIFY_PHONE_LOGIN: "notify_event_phone_login",//手机号登陆
        NOTIFY_PHONE_WANG: "notify_event_phone_wang",//手机登陆忘记密码
        NOTIFY_PHONE_REG: "notify_event_phone_reg",//手机注册
        NOTIFY_REF_RANK: "notify_event_ref_rank",//排行榜刷新
        NOTIFY_DEL_TOKEN: "notify_event_del_token",//删除token
        NOTIFY_REF_STORE: "notify_event_ref_store",//刷新商店数据
        NOTIFY_SHOW_KEYBOARD: "notify_event_show_keyboard",//数字键盘显示
        NOTIFY_JIUJI: "notify_event_main_jiuji",//救济金
        NOTIFY_GUIDE: "notify_event_main_guide",//救济金
        NOTIFY_SCREENPWD_SHOW: "notify_screenpwd_show",//屏幕隐藏密码开启
        NOTIFY_UPDATEDL_SHOW: "notify_updatedl_show",//登录界面下载子游戏
        NOTIFY_AD: "notify_event_main_ad",
    }

    //随机分享标题
    export const share_title_random = [
        "[@所有人]河北地道棋牌游戏!满满的都是家乡味儿！",
        "[有人@你]被这个人连赢了20把！！！快来救我！！（麻将）",
        "搓麻赢好礼  奖励拿不停",
        "只要麻将搓的好  奖励肯定少不了",
        "您有一张战书请查收！",
        "斗地主、打麻将，米面粮油免费拿！",
        "[有人@你]亲爱的，我在这赢了100元话费，你也快试试！",
    ]

}

