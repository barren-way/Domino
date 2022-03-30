
import NetData from "./../../../Games/Common/Script/NetData";
import { cfg } from '../../../Games/Common/Script/Config';
import { GameDef } from "../../../Games/Common/Script/GameDef";
import EventHandler from "../../../Framework/Script/Net/EventHandler";
import NetHttp from "../../../Framework/Script/Net/NetHttp";
import NetSocket from "../../../Framework/Script/Net/NetSocket";
import User from "../../../Framework/Script/Data/User";
import Dialog from "../../../Framework/Script/Tips/Dialog";
import Player from "../../../Framework/Script/Data/Player";
import Manager from "../../../Framework/Script/Engine/Manager";
import sdk from "../../../Framework/Script/Sdk/SdkManager";
import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import { NetConfig } from "../../../Framework/Script/Net/NetConfig";
import Tools from "./Tools";
import GameUtil from "./GameUtil";
import SdkManager from "../../../Framework/Script/Sdk/SdkManager";
import BundleManager from "../../../Framework/Script/Engine/BundleManager";
import BundleHotUpdate from "./BundleModule/BundleHotUpdate";
import NetModel from "./NetModel";
import AssetsManager from "./AssetsManager";

//游戏账号登录逻辑处理
export default class Account {
    private static mInstance: Account = null;
    private mLoginCb: Function = null;
    private mSigninCb: Function = null;
    private mSiginType: number = null;
    private mGameData: any = null;
    private invalid = false;
    private mWxCode = null;

    public static getInstance(): Account {
        if (!Account.mInstance) {
            Account.mInstance = new Account();
            Account.mInstance.init();
        }
        return Account.mInstance;
    }

    getSiginType(): number {
        return this.mSiginType;
    }

    init(): void {
        EventHandler.addEventListener("signin", this.signinGameOk.bind(this));
        EventHandler.addErrorListener("signin", this.signinGameError.bind(this));

        EventHandler.addEventListener("entergame", this.enterGameOk.bind(this));
        EventHandler.addErrorListener("entergame", this.enterGameError.bind(this));

        EventHandler.addEventListener("lobby.signin", this.signinLobbyOk.bind(this));
        EventHandler.addErrorListener("lobby.signin", this.signinLobbyError.bind(this));

        EventHandler.addEventListener("pdk.back", this.backPdkGameOk.bind(this));

        //创建朋友桌
        EventHandler.addEventListener("create", this.createGameOk.bind(this));
        EventHandler.addErrorListener("create", this.createGameError.bind(this));

        EventHandler.addEventListener("getroominfo", this.roomInfoOk.bind(this));

        EventHandler.addEventListener("lobby.inhouseflag", this.inhouseflagOk.bind(this));
        EventHandler.addErrorListener("lobby.inhouseflag", this.inhouseflagError.bind(this));
    }

    //登录用户服
    login(url: string, params: object, callback: Function): void {
        cc.log("Account login url:" + url)
        NetHttp.getInstance().send(url, params, this.getToken.bind(this), "user.getToken");
        this.mLoginCb = callback;
    }

    //账号注销
    logout(params?) {
        NetSocket.getInstance().release()
        Manager.getInstance().changeUI(GameDef.startScene)
    }

    //登录游戏服
    sigin(host: string, type: number, callback?: Function): boolean {
        this.mSigninCb = callback;
        this.mSiginType = type;
        let connectStr = "signin"
        if (type == 1) {
            connectStr = "lobby.signin"
        }
        let params = {
            gameid: GameDef.APP_GAMEID,
            macid: LocalDB.getString(GameDef.LOCAL_MACID_KEY, Tools.getRandMacId()),
            resver: cc.sys.isNative ? LocalDB.getString(GameDef.LOCAL_VERSION_KEY, cfg.Version) : AssetsManager.getInstance().getWebGameVersion(),
            apkver: SdkManager.getInstance().getAppVer(),
            platform: SdkManager.getInstance().getPlatForm(),
            device: cc.sys.os,
            osVersion: cc.sys.osVersion,
            token: User.getInstance().sid
        }
        let u_ip = SdkManager.getInstance().getDunUserIp();
        if (u_ip) {
            params["ip"] = u_ip
        }
        if (NetSocket.getInstance().isOnConnect()) {
            NetSocket.getInstance().send(connectStr, params, true);
        } else {
            NetSocket.getInstance().buildConnect(host, function () {
                NetSocket.getInstance().send(connectStr, params, true);
            }.bind(this));
        }
        return true
    }

    //通知服务区进入游戏服
    enterGame(gamedata) {
        this.mGameData = gamedata;
        NetSocket.getInstance().send('entergame', { gamename: gamedata.gamename }, true);
    }

    //是否在茶馆中（暂时没用）
    inhouseflag(houseid) {
        NetSocket.getInstance().send('lobby.inhouseflag', { houseid: houseid }, true);
    }

    getToken(result: string, event, args): void {
        console.log("getToken======" + JSON.stringify(args));
        if (result == NetConfig.HttpResult.OK) {
            //获取用户信息
            let ret = args.result
            var curTime = Math.floor(new Date().getTime() / 1000);
            if (cfg.isWx) {

                if (ret.token == undefined) {
                    if (this.mLoginCb) {
                        this.mLoginCb(1, args);
                    }
                    return;
                }

                User.getInstance().sid = ret.token;
                LocalDB.set(GameDef.LOCAL_TOKEN, ret.token)

                LocalDB.set(GameDef.LOCAL_TOKENTIME, curTime)
                //code有效直接初始化微信
                if (args.wxinfo != undefined) {
                    cc.log("cc.sys.platform==" + cc.sys.platform)
                    if (cc.sys.platform == cc.sys.WECHAT_GAME) {

                    } else {
                        if (window["WXSdk"]) {
                            window["WXSdk"].initWxSDK(args.wxinfo);
                            window["WXSdk"].wxShareFrends({ isWx: cfg.isWx, link: cfg.wxUrl })
                        }
                    }
                }

            } else {
                let userToken = LocalDB.get(GameDef.LOCAL_TOKEN)
                if (cfg.isLock) {
                    if (userToken) {
                        User.getInstance().sid = userToken;
                    } else if (ret.token != undefined) {
                        LocalDB.set(GameDef.LOCAL_TOKEN, ret.token);
                        LocalDB.set(GameDef.LOCAL_TOKENTIME, curTime)
                        User.getInstance().sid = ret.token;
                    }
                } else {
                    if (ret.token != undefined) {
                        User.getInstance().sid = ret.token;
                    }
                }
            }

            if (this.mLoginCb) {
                this.mLoginCb(0, args);
            }

        } else {
            if (this.mLoginCb) {
                this.mLoginCb(1, args);
            }
        }
    }

    inhouseflagOk(event, args, eventid) {
        switch (args.flag) {
            case 0:
                if (args.applyflag) {
                    Dialog.show(Dialog.TYPE_TIP, "等待圈主同意中...")
                } else {
                    if (args.autoverify == 1) {
                        let houseid = parseInt(User.getInstance().InviteInfo.houseid)
                        NetSocket.getInstance().send('lobby.applyhouse', { houseid: houseid }, true);
                    } else {
                        Dialog.show(Dialog.TYPE_TWO_BTN, "是否加入当前茶馆？", this.joinHouseTea.bind(this))
                    }
                }
                break;
            case 1:
                if (User.getInstance().InviteInfo.gamename != undefined) {
                    let data: any = {}
                    data.gamename = User.getInstance().InviteInfo.gamename;
                    data.entertype = "house";
                    data.roomid = parseInt(User.getInstance().InviteInfo.roomid);
                    Account.getInstance().siginEx(data);
                }
                break;
            default:
                break;
        }
    }

    joinHouseTea(data) {
        switch (data) {
            case 0:
                let houseid = parseInt(User.getInstance().InviteInfo.houseid)
                NetSocket.getInstance().send('lobby.applyhouse', { houseid: houseid }, true);
                User.getInstance().InviteInfo = null
                break;
            case 1:
                User.getInstance().InviteInfo = null
                break;
            default:
                User.getInstance().InviteInfo = null
                break;
        }
    }

    inhouseflagError(event, args, eventid) {

    }

    signinLobbyOk(event, args, eventid) {
        cc.log("cmd_signin------------------------:" + JSON.stringify(args))
        Player.getInstance().setInfo(args);

        //判断下是不是有大版本更新
        if (args.apkverinfo) {
            Dialog.show(Dialog.TYPE_ONE_BTN, "有新版本发布,请前往更新", () => {
                if (cc.sys.isNative) {
                    cc.sys.openURL(args.apkverinfo.url)
                } else {
                    window.location.href = args.apkverinfo.url
                }
            })
            return
        }
        //保存下子游戏的资源版本号
        if (args.gamevers && Tools.isMap(args.gamevers)) {
            LocalDB.setObject(GameDef.LOCAL_SUBGAME_VERSION, args.gamevers)
        }
        //下行检测是否要使用盾
        console.log("useDun state:" + NetModel.isUseDun())

        NetModel.setUseDun(args.shield)

        if (this.mSigninCb) {
            this.invalid = false
            this.mSigninCb([args, 0])
            this.mSigninCb = null;
        }
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            this.init_voice();
        }
    }

    signinLobbyError(code, event, message) {
        console.log("signinLobbyError code=" + code)
        if (code == 11) {
            this.invalid = true
            NetSocket.getInstance().release()
        }
        //判断下是不是有资源版本更新
        if (code == 666 && message != "") {
            NetSocket.getInstance().release()
            Dialog.show(Dialog.TYPE_ONE_BTN, message, () => {
                cc.game.restart()
            })
            return true //需要屏蔽底层的错误提示
        }
        if (this.mSigninCb) {
            if (code != NetConfig.SocketError.ERROR_SOCKET_CLOSING) {
                this.mSigninCb([code, 1])
                this.mSigninCb = null;
            }
        }
    }

    signinGameOk(event, args, eventid): void {
        Player.getInstance().setInfo(args);
        let gameplay = NetData.getPlaying()
        let gameid = (gameplay && gameplay.gameid > 0) ? gameplay.gameid : GameDef.GIDS[this.mGameData.gamename]
        //检测下游戏是否已经下载
        BundleHotUpdate.getInstance().checkBundleUpdate(gameid, (result) => {
            if (result == 1) {
                if (gameplay && gameplay.gameid > 0) {
                    console.log("gameplay========" + JSON.stringify(gameplay))
                    //查看是否有断连信息
                    let uiData = { ui: GameDef.mainScene, type: "playing" }
                    GameUtil.swithUI(gameplay.gameid, uiData, true, true)
                    return
                }

                let curgame = BundleManager.getInstance().getAppByGameId(gameid)
                switch (this.mGameData.entertype) {
                    case "hall":
                        {
                            if (this.mGameData.states != undefined) {
                                //tdhfriend需要特殊处理下
                                if (!Tools.SafeCallFunc(curgame, "preSigninCallHall", this.mGameData)) {
                                    let leave_room = this.mGameData.states.daikai == 1 ? 1 : null
                                    NetSocket.getInstance().send('create', { "states": this.mGameData.states, "leave_room": leave_room }, true);
                                }
                            }
                        }
                        break;
                    case "house":
                        {
                            if (this.mGameData.roomid != undefined) {
                                let houseid
                                if (User.getInstance().InviteInfo != undefined) {
                                    houseid = User.getInstance().InviteInfo.houseid
                                }
                                if (!Tools.SafeCallFunc(curgame, "preSigninCallHouse", this.mGameData)) {
                                    NetSocket.getInstance().send('majiang.joindesk_house', { "code": Number(this.mGameData.roomid), houseid: houseid }, true);
                                }
                            }

                        }
                        break;
                    case "look": //创建房间弹版选项
                        {
                            if (this.mGameData.callback) {
                                this.mGameData.callback()
                            }
                        }
                        break;
                    case "join":
                        {
                            if (this.mGameData.roomid != undefined) {
                                NetSocket.getInstance().send('join', { roomid: Number(this.mGameData.roomid) }, true);
                            }
                        }
                        break;
                    case "match": //淘汰赛
                    case "train": //练习赛
                        {
                            let params = {}
                            params["ui"] = GameDef.mainScene
                            params["matchdata"] = this.mGameData.matchdata
                            params["type"] = "create"
                            GameUtil.swithUI(gameid, params, true)
                        }
                        break;
                    case "joingame": //练习赛
                        {
                            let params = {}
                            params["ui"] = GameDef.mainScene
                            params["type"] = "match"
                            GameUtil.swithUI(gameid, params, true)
                        }
                        break; 
                }
                User.getInstance().InviteInfo = null;
            }
        })
    }

    signinGameError(code, event, message): void {
        //    Dialog.show(Dialog.TYPE_TIP, "进入游戏失败，稍候请重试~~~");
    }

    enterGameOk(event, args, eventid): void {
        this.sigin(this.mGameData.serverUrl, 0);
    }

    enterGameError(code, event, message): void {
        // Dialog.show(Dialog.TYPE_TIP, "进入游戏失败，稍候请重试~~~");
    }

    //跑得快断连回来
    backPdkGameOk(event, args, eventid): void {
    }

    siginEx(gamedata = null): boolean {
        if (gamedata != null) {
            this.mGameData = gamedata;
        }
        let connectStr = "signin"
        let showwait = this.mGameData && this.mGameData.showwait
        if (NetSocket.getInstance().isOnConnect()) {
            NetSocket.getInstance().send(connectStr, { "gamename": this.mGameData.gamename, "token": User.getInstance().sid, "iosflag": 0 }, showwait);
        } else {
            NetSocket.getInstance().buildConnect(this.mGameData.serverUrl, function () {
                NetSocket.getInstance().send(connectStr, { "gamename": this.mGameData.gamename }, true);
            }.bind(this));
        }
        return true
    }

    createGameOk(event, args, eventid): void {
        function ad_call(gameid) {
            let uiData = {
                ui: GameDef.mainScene,
                type: "create",
                args: args
            }
            GameUtil.swithUI(gameid, uiData, true)
        }

        if (this.mGameData.gamename) {
            let gameid = GameDef.GIDS[this.mGameData.gamename]
            if (args.states.daikai == 0) {
                ad_call(gameid)
            } else {
                if (this.mGameData.noderoom != undefined) {
                    this.mGameData.noderoom.getComponent("Dating_Agent").Open(1, 2);
                    Dialog.show(Dialog.TYPE_ONE_BTN, "代开房成功，房间号：" + args.roomid);
                }
            }
        }
    }

    createGameError(code, event, message): void {

    }

    //拉取房间信息
    getRoomInfo(gamedata) {

        this.mGameData = gamedata;
        NetSocket.getInstance().send('getroominfo', { "roomid": this.mGameData.roomid }, true);

    }

    roomInfoOk(event, args, eventid): void {

        this.mGameData.gamename = args.gamename;
        this.siginEx();

    }

    getGameData() {
        return this.mGameData;
    }

    //麻将创建房间之后的回调
    MJcreateGameOk(event, args, eventid): void {
        if (args.states.daikai == 0) {
            let gameid = GameDef.GIDS[this.mGameData.gamename]
            let uiData = { ui: GameDef.mainScene, type: "create", args: args }
            GameUtil.swithUI(gameid, uiData, true)
        } else {
            if (this.mGameData.noderoom != undefined) {
                this.mGameData.noderoom.getComponent("Dating_Agent").Open(1, 2);
                Dialog.show(Dialog.TYPE_ONE_BTN, "代开房成功，房间号：" + args.code);
            }
        }
    }

    WxInfo(url: string, params: object): void {
        NetHttp.getInstance().send(url, params, this.getWxInfo.bind(this), "user.wxInfo", true);

    }

    getWxInfo(result: string, event, args): void {
        if (args == undefined) {
            console.log("error wxinfo is null");
            return;
        }
        console.log(JSON.stringify(args))
        if (args.result != undefined && args.result.wxinfo != undefined) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            } else {
                window["WXSdk"].initWxSDK(args.result.wxinfo);
            }

        }

    }

    init_voice() {
        if (cfg.yimUrl) {
            let id = Player.getInstance().getInfoBykey("id");
            let nick = Player.getInstance().getInfoBykey("nick");
            let sid = User.getInstance().sid;
            NetHttp.getInstance().send(cfg.yimUrl, { UserID: id, NickName: nick, Token: sid }, this.yimSignOk.bind(this), "user.yimToker", true, "GET");
        }
    }

    yimSignOk(result: string, event, args): void {
        if (result == NetConfig.HttpResult.OK) {
            console.log(JSON.stringify(args));
            if (args && args.result) {
                let u_data = args.result.UserList[0];
                if (u_data) {
                    let id = u_data.UserID + "";
                    let sid = u_data.Token + "";
                    sdk.getInstance().saveUserInfo(id, sid);
                }
            }
        }
    }

    public setWxCode(data): void {
        this.mWxCode = data
    }

    public getWxCode(): number {
        return this.mWxCode
    }

}
