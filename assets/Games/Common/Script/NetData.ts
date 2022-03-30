import Player from "../../../Framework/Script/Data/Player";
import Dialog from "./../../../Framework/Script/Tips/Dialog";
import Radio from "../../../Framework/Script/Data/Radio";
import Manager from "./../../../Framework/Script/Engine/Manager"
import NetSocket from "./../../../Framework/Script/Net/NetSocket";
import { GameDef } from './GameDef';
import User from "../../../Framework/Script/Data/User";
import { MainDef } from "../../Dating/Script/MainDef";
import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import Account from "./Account";
import ChargeManager from "./ChargeManager";
import GlobalUI from "./GlobalUI";
import Global from "./Global";
import GameUtil from "./GameUtil";
import BundleManager from "../../../Framework/Script/Engine/BundleManager";
import NetModel from "./NetModel";


export default class NetData {
    private static mEventListeners: { [key: string]: Array<any> } = {};
    private static mErrorListeners: { [key: string]: Array<any> } = {};
    private static mSyncFlag: number = null;
    private static mPlaying: any = null;

    //本地需刷新的用户数据字段
    private static INCR_NAME = ["gold", "addr", "nick", "avatar", "roomcard", "phone", "imguri", "self_gold", "matchticket"]

    //全局通用消息
    public static pubEvents = ["useprop"]

    //麻将游戏通用接口
    public static mjEvents = [
        "getlongtitude", "start", "master", "kick", "quit", "join", "agree", "apply",
        "dismiss", "zhuaevent", "zhua", "chu", "chi", "peng", "gang", "pass", "hu",
        "result", "offline", "online", "auto", "ready", "check", "syncinfo", "ting",
        "face", "speak", "message",
    ];

    //比赛通用接口
    public static matchEvents = ["marry", "nextturn", "deskover", "outapply", "giveup", "over", "rank"]

    public static getCache(gameid): Array<string> {

        let curgame = BundleManager.getInstance().getAppByGameId(gameid)
        return curgame.getCacheEvents()
    }

    public static clearEventListener() {
        NetData.mEventListeners = {};
        NetData.mErrorListeners = {};
    }

    public static addEventListener(event: string, callback: Function, tag?: string): void {
        if (!NetData.mEventListeners[event]) {
            NetData.mEventListeners[event] = []
        }
        NetData.mEventListeners[event].push({ callback: callback, tag: tag });
    }

    public static removeEventListener(event: string, tag?: string): void {
        if (tag) {
            let cbs = NetData.mEventListeners[event]
            if (Object.prototype.toString.call(cbs) == '[object Array]') {
                for (let i = 0; i < cbs.length; i++) {
                    if (cbs[i].tag == tag) {
                        cbs.splice(i, 1)
                        break
                    }
                }
                if (cbs.length == 0) {
                    delete NetData.mEventListeners[event]
                }
            }
        } else {
            delete NetData.mEventListeners[event]
        }
    }

    public static addErrorListener(event: string, callback: Function, tag?: string): void {
        if (!NetData.mErrorListeners[event]) {
            NetData.mErrorListeners[event] = []
        }
        NetData.mErrorListeners[event].push({ callback: callback, tag: tag });
    }

    public static removeErrorListener(event: string, tag?: string): void {
        if (tag) {
            let cbs = NetData.mErrorListeners[event]
            if (Object.prototype.toString.call(cbs) == '[object Array]') {
                for (let i = 0; i < cbs.length; i++) {
                    if (cbs[i].tag == tag) {
                        cbs.splice(i, 1)
                        break
                    }
                }
                if (cbs.length == 0) {
                    delete NetData.mErrorListeners[event]
                }
            }
        } else {
            delete NetData.mErrorListeners[event]
        }
    }

    public static setSyncFlag(flag?: number): void {
        this.mSyncFlag = flag;
    }

    public static getSyncFlag(flag?: number): any {
        return this.mSyncFlag;
    }

    public static setPlaying(playing?: any) {
        this.mPlaying = playing;
    }

    public static getPlaying() {
        return this.mPlaying;
    }

    public static checkPlaying(): boolean {
        if (this.mPlaying) {
            let flag = false
            if (this.mPlaying.gameid) {
                flag = true
                var gamedata = GameDef.GNAMES[this.mPlaying.gameid];
                if (gamedata && gamedata.gamename) {
                    Account.getInstance().siginEx(gamedata);
                } else {
                    console.log("error game index is " + this.mPlaying.gameid);
                }
            }
            return flag
        }
        return false
    }

    public static checkInvite(): boolean {

        if (User.getInstance().InviteInfo && User.getInstance().InviteInfo.roomid != undefined) {
            if (User.getInstance().InviteInfo && User.getInstance().InviteInfo.houseid != undefined) {
                let houseid = parseInt(User.getInstance().InviteInfo.houseid)
                Account.getInstance().inhouseflag(houseid)
            } else {
                var data: any = {}
                data.roomid = parseInt(User.getInstance().InviteInfo.roomid);
                data.entertype = "join";
                Account.getInstance().getRoomInfo(data)
                User.getInstance().InviteInfo = null;
            }
            return true;
        }
        return false;
    }

    public static backToLogin() {
        LocalDB.setInt(GameDef.AUTOLOGIN_TYPENAME, -1)
        Global.getInstance().setData("AutoLG", false);
        NetSocket.getInstance().release();
        Manager.getInstance().changeUI(GameDef.startScene)
    }

    public static ResetServer() {
        let flag = NetModel.isUseDun()
        console.log("NetData ResetServer flag==" + flag)
        if (flag != NetModel.DUN_OPEN) {
            //2代表的意思:gate都不通的时候，自动切换到盾
            if (flag !== NetModel.GATE_OPEN) {
                NetModel.setUseDun(flag == 2 ? NetModel.DUN_CLOSE : 2)
            } else {
                //盾一直没试通，强行切到gate继续试
                NetModel.setUseDun(NetModel.DUN_CLOSE)
            }
        }
    }

    public static handleEvent(event, args, eventid): boolean {
        let ret = false;
        if (event == "radio") {
            let state = { rType: args.type, content: decodeURI(args.msg), times: args.times }
            if (args.type == 2) {
                Radio.getInstance().setDefalutRadioData([state])
            } else {
                Radio.getInstance().addHomeRadioData(state)
            }
        } else if (event == "lobby.signin") {
            if (args.sign7) {
                Global.getInstance().setSign7Info(args.sign7)
            }
            if (args.poor) {
                Global.getInstance().setJiujiInfo(args.poor)
            }
            if (args.task) {
                Global.getInstance().setMissionRedInfo(args.task)
            }

            //比赛公告存储，要提前设置
            if (args.matchinfo) {
                let notices = []
                for (const v of args.matchinfo) {
                    if (v.notice) {
                        notices.push(v.notice)
                    }
                }
                if (notices.length > 0) {
                    Global.getInstance().setMatchNoticeInfo(notices)
                }
            }

            if (args.infos && args.infos.gameid) {
                NetData.setPlaying(args.infos)
            } else if (args.matchinfo) {
                NetData.setPlaying({ matchinfo: args.matchinfo })
            } else {
                NetData.setPlaying()
            }
        }
        if (event == "poor") {
            //救济金领取
            Global.getInstance().setJiujiInfo(args)
            Dialog.show(Dialog.TYPE_ONE_BTN, "救济金已到账，赶快去领取吧!")
        }

        if (event == "task_red") {
            //任务红点提示
            Global.getInstance().setMissionRedInfo({ redflag: 1 })
        }

        //比赛即将开始公告
        if (event == "cast.notice") {
            Dialog.show(Dialog.TYPE_ONE_BTN, args.content)
        }

        if (event == "emergency") {
            //盾通知
            NetModel.setUseDun(args.shieldactivation)
        }

        if (event == "board") {
            if (args.type == 0) {
                NetSocket.getInstance().release();
                Dialog.show(Dialog.TYPE_ONE_BTN, args.msg, function () {
                    switch (args.code) {
                        //TODO后期优化，现在会出现bug当在繁体版的提示中时
                        case 11:
                            LocalDB.remove(GameDef.LOCAL_TOKEN)
                            Manager.getInstance().hideWaitAni()
                            cc.director.emit(GameDef.EVENTS.NOTIFY_DEL_TOKEN)
                            break;
                        default:
                            Manager.getInstance().changeUI(GameDef.startScene)
                            break;
                    }

                }.bind(this));
            } else {
                Dialog.show(Dialog.TYPE_ONE_BTN, args.msg)
            }
            return true
        }

        if (args) {
            if (args.error && args.error.message) {
                Dialog.show(Dialog.TYPE_TIP, args.error.message)
                return true
            }

            //====start新的更新玩家数据结构方式，将会逐步取代老的数据更新方式
            let myPlayer = Player.getInstance()

            if (args.ad_n) {
                myPlayer.setInfoBykey("ad_n", args.ad_n)
            }

            let updateuser = false
            if (event != 'lobby.signin') {
                //更新玩家数据
                if (args.info_update) {
                    updateuser = true
                    myPlayer.updateInfo(args.info_update)
                    cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO)
                    cc.director.emit(MainDef.EVENTS.NOTIFY_REF_MAIN_HEADINFO)
                    cc.director.emit(MainDef.WINS.SIGN7.notify)
                }
                //更新道具
                if (args.item_update) {
                    updateuser = true
                    myPlayer.updateItems(args.item_update, true)
                    cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO)
                }

                //充值测试
                if (ChargeManager.chargeTestCallback) {
                    cc.log("do ChargeManager.chargeTestCallback")
                    ChargeManager.chargeTestCallback({ code: 0 })
                    ChargeManager.chargeTestCallback = null
                }

            }
            //====en
            if (event == "cast.user.update") {
                if (args.gold) {
                    if (typeof (args.gold) == "object" && args.gold.gold) {
                        myPlayer.setInfoBykey("gold", args.gold.gold)
                    } else if (typeof (args.gold) == "number") {
                        myPlayer.setInfoBykey("gold", args.gold)
                    }
                }
                if (args.addr) {
                    myPlayer.setInfoBykey("addr", args.addr)
                }
                if (args.nick) {
                    myPlayer.setInfoBykey("nick", args.nick)
                }
                if (args.avatar) {
                    myPlayer.setInfoBykey("avatar", args.avatar)
                }
                if (args.roomcard) {
                    myPlayer.setInfoBykey("roomcard", args.roomcard)
                }
                if (args.phone) {
                    myPlayer.setInfoBykey("phone", args.phone)
                }
                if (args.imguri) { //刷新名片
                    console.log("NetData args.imguri:" + args.imguri)
                    myPlayer.setInfoBykey("imguri", args.imguri)
                    cc.director.emit(MainDef.EVENTS.NOTIFY_REF_IMGURI)
                }
                updateuser = true
            } else if (event == "roomcard") {
                if (args.roomcard) {
                    myPlayer.setInfoBykey("roomcard", args.roomcard)
                }
                updateuser = true
            }

            if (args.self_gold) {
                updateuser = true
                myPlayer.setInfoBykey("gold", args.self_gold)
            }

            if (args.self_gold) {
                updateuser = true
                myPlayer.setInfoBykey("gold", args.self_gold)
            }

            if (args.default_notice) {
                Radio.getInstance().setDefalutRadioData(args.default_notice)
            }

            if (args.kefuinfo) {
                LocalDB.setString("kefuinfo", args.kefuinfo.content)
            }

            if (args.pay_notice) {
                LocalDB.setString("pay_notice", args.pay_notice.content)
            }

            if (args.lc_match_reward) {
                Global.getInstance().setData("lc_match_reward", args.lc_match_reward)
            }

            if (args.lc_ad) {
                Global.getInstance().setData("lc_ad", args.lc_ad)
            }

            if (updateuser) {
                this.INCR_NAME.forEach(v => {
                    if (args[v]) {
                        cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO);
                        return false
                    }
                });

                //商城充值刷新
                let uiscript = Manager.getInstance().getGlobalUI(GlobalUI.TYPE_CREATE_STORE)
                if (uiscript && uiscript["isShow"]()) {
                    cc.director.emit(GameDef.EVENTS.NOTIFY_REF_STORE)
                }

                //救济金刷新
                uiscript = Manager.getInstance().getGlobalUI(GlobalUI.TYPE_CREATE_JIUJI)
                if (uiscript && uiscript["isShow"]()) {
                    cc.director.emit(GameDef.EVENTS.NOTIFY_JIUJI)
                }
            }
        }

        if (event != "ping") {
            for (let key in NetData.mEventListeners) {
                if (key == event) {
                    let cbs = NetData.mEventListeners[key]
                    if (Object.prototype.toString.call(cbs) == '[object Array]') {
                        for (let i = cbs.length - 1; i > -1; i--) {
                            ret = cbs[i].callback(event, args, eventid)
                            if (ret) {
                                break
                            }
                        }
                    }
                    break
                }
            }
        }
        return ret
    }

    public static handleError(code: number, event: string = null, message: string = null): boolean {
        let ret: boolean = false;
        do {
            for (const key in NetData.mErrorListeners) {
                let cbs = NetData.mErrorListeners[key]
                if (Object.prototype.toString.call(cbs) == '[object Array]') {
                    for (let i = cbs.length - 1; i > -1; i--) {
                        ret = cbs[i].callback(code, event, message)
                        if (ret) {
                            break
                        }
                    }
                }
                if (ret) {
                    break;
                }
            }

            if (ret) {
                break;
            }

            if (code > 0) {
                //这里处理游戏相关的错误
                if (message) {
                    Dialog.show(Dialog.TYPE_TIP, message);
                }
                if (code == 9999) { //teamatch返回的特殊错误码
                    GameUtil.changeToLogin()
                }
            }
        } while (false)
        return ret;
    }
    public static HttpResult(event, args, eventid) {
        return false
    }

    public static HttpError(event, args, eventid) {
        return false
    }
}
