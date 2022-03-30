import { g } from '../../../Framework/Script/G'
import { cfg } from '../Script/Config';
import NetData from './NetData';
import { GameDef } from './GameDef';
import LocalDB from '../../../Framework/Script/Engine/LocalDB';
import NetModel from './NetModel';
import GameUtil from './GameUtil';
import Tools from './Tools';
import AssetsManager from './AssetsManager';

const { ccclass, property } = cc._decorator;
@ccclass
export default class LoginUI extends cc.Component {
    @property(cc.Node)
    private mNodTel: cc.Node = null; //手机登录弹板
    @property(cc.Node)
    private mBtnTel: cc.Node = null; //手机登录按钮
    @property(cc.Node)
    private mBtnGuest: cc.Node = null; //游客登录按钮
    @property(cc.Node)
    private mNodAgreeMent: cc.Node = null; //用户协议界面
    @property(cc.Toggle)
    private mTogAMent: cc.Toggle = null; //用户协议选择

    @property(cc.Label)
    private mLabVersion: cc.Label = null;//资源版本号
    private m_userToken = null;
    private m_userWxCode = null;

    onLoad() {
        g.Sdk.init();
        //g.GameUtil.preloadMainUIPrefab()
        this.mBtnGuest.active = false
        if (!cfg.isFormal) {
            this.mBtnGuest.active = true;
        }
        cc.director.on(GameDef.EVENTS.NOTIFY_DEL_TOKEN, this.delUserToken, this)
        g.Sdk.callUnkownFuction("onShareCallback", () => { return GameUtil.getShareParam() });

        if (!LocalDB.getString(GameDef.LOCAL_MACID_KEY)) {
            LocalDB.setString(GameDef.LOCAL_MACID_KEY, Tools.getRandMacId())
        }
        this.mLabVersion.string = cc.sys.isNative ? "v" + LocalDB.getString(GameDef.LOCAL_VERSION_KEY, cfg.Version) : "v" + AssetsManager.getInstance().getWebGameVersion()
    }

    onCreate(p) {
        if (p && p.delToken) {
            this.delUserToken()
        }
    }

    start() {

        this.mBtnTel.active = !(cc.sys.platform == cc.sys.WECHAT_GAME)
        //用户协议首次进游戏默认不勾选
        let first_login = LocalDB.getInt(GameDef.GAME_AGREEMENT_FLAG, 0)
        this.mTogAMent.isChecked = first_login > 0

        var tokentime = LocalDB.get(GameDef.LOCAL_TOKENTIME)

        var curTime = Math.floor(new Date().getTime() / 1000);
        if (tokentime) {
            if (curTime - tokentime < (GameDef.LOCAL_TOKENSAVE * 24 * 60 * 60)) {
                this.m_userToken = LocalDB.get(GameDef.LOCAL_TOKEN) //本地存储的微信code
            }
        }

        this.m_userWxCode = LocalDB.get(GameDef.LOCAL_WXCODE) //本地存储的微信code

        var params = {}
        //处理链接所带的参数
        params = this.splitURL()
        if (params["test"] && params["test"] == "testss") {
            this.mBtnGuest.active = true
        }
        //用户特殊类型赋值
        g.User.InviteInfo = {
            "roomid": params["roomid"],
            "gamename": params["gamename"],
            "roomtype": params["roomtype"],
            "houseid": params["houseid"],
            "source_member": params["source_member"]
        };

        //如果链接带token直接登陆
        if (params["token"]) {
            g.User.sid = params["token"];
            g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_GUEST);
            this.signin();
            return
        }

        if (params["code"] && this.m_userWxCode != params["code"]) {
            g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_WX);
            this.wechat_code(params["code"])
            return
        }

        //获取是否自动登陆游戏
        var AutoLG = g.Global.getData("AutoLG");
        console.log("AutoLG=====" + AutoLG);
        let autologin_type = LocalDB.getInt(GameDef.AUTOLOGIN_TYPENAME, -1)
        console.log("autologin_type=====" + autologin_type);
        if (autologin_type > -1) {
            AutoLG = true
        }
        //AutoLG = false //先屏蔽自动登录
        if (AutoLG) {
            if (autologin_type == GameDef.LOGIN_TEL) {
                g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_TEL);
            } else if (autologin_type == GameDef.LOGIN_WX) {
                g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_WX);
            } else if (autologin_type == GameDef.LOGIN_GUEST) {
                g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_GUEST);
            } else if (autologin_type == GameDef.LOGIN_MW) {
                g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_MW);
            }
            if (this.m_userToken) {
                g.User.sid = this.m_userToken;
                cc.log("有token 自动登陆:" + g.User.sid);
                this.signin();
            }
        }

        cc.director.emit(GameDef.EVENTS.NOTIFY_SCREENPWD_SHOW, { login: true })

    }

    //处理链接所带的参数
    splitURL() {
        let params = {}
        let curURL = window.location.href;
        let dcURl = decodeURIComponent(curURL);
        let arrURL = dcURl.split("?");
        if (arrURL.length >= 2) {
            let stURL = arrURL[1].split("&");
            for (let i = 0; i < stURL.length; i++) {
                var b = stURL[i].split("=");
                params[b[0]] = b[1];
            }
        }
        if (params["code"]) {
            g.Account.setWxCode(params["code"])
        }
        return params
    }

    login(): void {
        window.location.href = cfg.userServer;
    }

    loginResult(ret, args): void {
        if (ret == 0) {
            //登录用户服成功
            this.signin();
        } else {
            //登录用户服失败
            g.Dialog.show(g.Dialog.TYPE_ONE_BTN, "登陆失败,请重试...", function () {
                //this.login();
                if (args && args.code == -100) {
                    //网络不通,切换到下一个地址
                    NetModel.nextUrl()
                }
            }.bind(this));
        }
    }

    signin() {
        let isWxBtn = g.Global.getData(GameDef.LOGIN_TYPENAME) == GameDef.LOGIN_WX
        if (cfg.isWx && !cc.sys.isNative && isWxBtn && cc.sys.platform != cc.sys.WECHAT_GAME) {
            let params = { url: window.location.href };
            g.Account.WxInfo(g.NetModel.getUsHost() + cfg.userWxInfo, params);
        }

        g.Account.sigin(g.NetModel.getGameSvr(), 1, this.signinResult.bind(this));
    }

    signinResult(ret, message): Boolean {
        console.log("signinResult ret:" + ret[1])
        if (ret[1] == 0) {
            //登录大厅成功
            cc.log("登录大厅成功");
            let logintype = g.Global.getData(GameDef.LOGIN_TYPENAME)
            LocalDB.setInt(GameDef.AUTOLOGIN_TYPENAME, logintype)
            cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO);
            if (!NetData.checkPlaying()) {
                let u_data = {}
                u_data["notice"] = true
                g.Manager.changeUI(GameDef.mainScene, u_data);
            }
            return true
        } else {
            //登录大厅失败
            cc.log("登录大厅失败");
            //TODO 登录失败，需要连续试3次，不行后弹板儿踢出
            if (message) {
                g.Dialog.show(g.Dialog.TYPE_ONE_BTN, "登陆失败,请重试...", function () {
                    if (ret[0] == 11) {
                        LocalDB.remove(GameDef.LOCAL_TOKEN)
                        this.ButtonGuest();
                    } else {
                        this.signin();
                    }

                }.bind(this));
                return true
            }
        }
        return false
    }

    update(dt) {
        //TODO 这儿需要更新一下loading
    }

    wechat_code(code) { //微信登陆这里诡异会调用两次
        console.log("wechat_code code:" + code)
        if (code) {
            let params = this.splitURL()

            let paramswx = {}
            paramswx["ch"] = 5300001
            paramswx["uid"] = code
            paramswx["url"] = window.location.href
            if (CC_JSB) { paramswx["app"] = 1 }
            paramswx["chid"] = 1
            paramswx["source_member"] = g.User.InviteInfo.source_member
            paramswx["eventid"] = 1
            paramswx["promoterid"] = 1
            paramswx["round"] = 1

            LocalDB.setString(GameDef.LOCAL_WXCODE, code)

            //区分H5与原生端
            let callBack = CC_JSB ? this.appResult.bind(this) : this.loginResult.bind(this)
            g.Account.login(g.NetModel.getUsHost() + cfg.userSeverWx, paramswx, callBack);

        } else {
            g.Dialog.show(g.Dialog.TYPE_ONE_BTN, "获取code失败", function () {
                //this.login();
            }.bind(this));
        }
    }
    //小游戏获取微信code
    wechatgame_code(ret, args?) {
        console.log("wechatgame_code ret:" + ret)
        if (ret == 0 && args) {
            args["ch"] = 5300001
            args["url"] = window.location.href
            args["chid"] = 1
            args["source_member"] = g.User.InviteInfo.source_member
            args["eventid"] = 1
            args["promoterid"] = 1
            args["round"] = 1
            args["wechat"] = 1
            g.Account.login(g.NetModel.getUsHost() + cfg.userSeverWx, args, this.loginResult.bind(this));
        } else {
            if (ret == 2) {
                //需要获取用户信息
                g.Sdk.callUnkownFuction("createUserInfoButton", { callback: this.wechatgame_code.bind(this) })
            } else {
                g.Dialog.show(g.Dialog.TYPE_ONE_BTN, "获取code失败", function () {
                    //this.login();
                }.bind(this));
            }
        }
    }

    appResult(ret, args): void {
        console.log("appResult args:" + JSON.stringify(args))
        if (ret == 0 && args.result) {
            //登录用户服成功
            g.User.sid = args.result.token;
            cc.log("登陆成功:" + g.User.sid);
            g.Account.sigin(NetModel.getGameSvr(), 1, this.signinResult.bind(this));
        } else {
            //登录用户服失败
            cc.log("登陆失败:" + g.User.sid);
            let message = (args && args.message) || "登陆失败,请重试..."
            g.Dialog.show(g.Dialog.TYPE_TIP, message);
        }
    }

    ButtonWx() {
        g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_WX);
        if (!this.mTogAMent.isChecked) {
            g.Dialog.show(g.Dialog.TYPE_TIP, "请同意游戏用户协议与隐私政策!");
            return
        }

        if (this.m_userToken) {
            g.User.sid = this.m_userToken;
            cc.log("ButtonWx 有token 自动登陆:" + g.User.sid);
            this.signin();
            return
        }

        //apk微信拉取
        if (CC_JSB) {
            g.Sdk.regist_event("event_wechat_login", this.wechat_code.bind(this));
            g.Sdk.login(null, null);
            return;
        }

        //微信小游戏拉取
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            g.Sdk.callUnkownFuction("wechatGameLogin", { callback: this.wechatgame_code.bind(this) })
            return
        }

        //h5微信拉取
        var html = cfg.wxUrl + "?";
        if (g.User.InviteInfo.roomid != undefined) {
            html += "roomid=" + g.User.InviteInfo.roomid;
        }

        if (g.User.InviteInfo.roomtype != undefined) {
            html += "&roomtype=" + g.User.InviteInfo.roomtype;
        }

        if (g.User.InviteInfo.houseid != undefined) {
            html += "&houseid=" + g.User.InviteInfo.houseid;
        }

        if (g.User.InviteInfo.gamename != undefined) {
            html += "&gamename=" + g.User.InviteInfo.gamename;
        }

        window.location.href = html;
    }


    ButtonGuest() {
        g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_GUEST);
        if (this.m_userToken) {
            g.User.sid = this.m_userToken;
            cc.log("ButtonGuest 有token 自动登陆:" + g.User.sid);
            this.signin();
            return
        }
        let params = { ch: 5300001, imei: "CAM-AL00_6.0", url: window.location.href };
        g.Account.login(g.NetModel.getUsHost() + cfg.userServer, params, this.loginResult.bind(this));
    }

    ButtonTel() {

        if (!this.mTogAMent.isChecked) {
            g.Dialog.show(g.Dialog.TYPE_TIP, "请同意游戏用户协议与隐私政策!");
            return
        }
        
        this.mNodTel.active = true
        cc.director.emit(GameDef.EVENTS.NOTIFY_PHONE_LOGIN, { callback: this.appResult.bind(this) })
    }

    delUserToken() {
        this.m_userToken = null
    }

    ButtonCloseAgreement() {
        this.mNodAgreeMent.active = false
    }

    ButtonOpenAgreement() {
        this.mNodAgreeMent.active = true
    }

    TogClicked(toggle) {
        if (toggle._pressed) {
            LocalDB.setInt(GameDef.GAME_AGREEMENT_FLAG, toggle.isChecked ? 1 : 0)
        }
    }
}
