import { g } from '../../../Framework/Script/G'
import { cfg } from '../../Common/Script/Config';
import { GameDef } from '../../Common/Script/GameDef';
import { MainDef } from './MainDef';
import NetModel from '../../Common/Script/NetModel';
import LocalDB from '../../../Framework/Script/Engine/LocalDB';
import Tools from '../../Common/Script/Tools';


const { ccclass, property } = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {

    //玩家信息
    @property(cc.Node)
    mNodPlayerHead: cc.Node = null;
    @property(cc.Label)
    mLabPlayerId: cc.Label = null
    @property(cc.Label)
    mLabPlayerNick: cc.Label = null
    @property(cc.Label)
    mLabPlayerLv: cc.Label = null
    @property(cc.Node)
    mNodVip: cc.Node = null

    @property(cc.Label)
    mLabVersion: cc.Label = null //游戏版本号

    @property(cc.Node)
    mMailRedOp: cc.Node = null //邮件红点


    @property(cc.Node)
    mNodLayBoard: cc.Node = null //储存所有弹板

    private m_userInfo = null;

    private m_data = null //ui切换传递过来的数据


    onLoad() {
        cc.log("MainUI onLoad start")
    }

    start() {
        this.mLabVersion.string = cc.sys.isNative ? "v" + LocalDB.getString(GameDef.LOCAL_VERSION_KEY, cfg.Version) : "v" + g.AssetsMgr.getWebGameVersion()
    }

    onCreate(p) {
        cc.log("MainUI onCreate start")
        this.m_data = p ? p : {}

        cc.log("MainUI this.m_data:" + JSON.stringify(this.m_data))

        g.Sdk.leaveRoom();

        cc.log("MainUI onCreate end")
    }

    onEnable() {
        cc.log("MainUI onEnable start")
        cc.director.on("closeGameWindow", this.windowProcess, this)
        cc.director.on(MainDef.EVENTS.NOTIFY_REF_MAIN_HEADINFO, this.refPlayerView, this)
        cc.director.emit(GameDef.EVENTS.NOTIFY_REF_USERINFO)
        g.AudioMgr.playMusic("dating")
        this.refPlayerView()
        g.GlobalShare.initShareInfo()

        this.checkMailRedTip()

        cc.log("MainUI onEnable end")
    }

    onDisable() {
        cc.director.off("closeGameWindow", this.windowProcess, this)
        cc.director.off(MainDef.EVENTS.NOTIFY_REF_MAIN_HEADINFO, this.refPlayerView, this)
    }

    onDestroy() {
        cc.log("MainUI onDestroy start")
        g.Dialog.clear()
        cc.log("MainUI onDestroy end")
    }

    refPlayerView() {
        cc.log("MainUI refPlayerView start")
        this.m_userInfo = g.Player.getAllInfo()
        // this.mLabPlayerNick.string = decodeURI(this.m_userInfo.nick)
        // this.mLabPlayerId.string = "ID:" + this.m_userInfo.id
        // this.mLabPlayerLv.string = "Lv." + this.m_userInfo.lv
        // g.GameUtil.DrawHead(this.mNodPlayerHead.getComponent(cc.Sprite), this.m_userInfo.avatar)
        // this.mNodVip.active = this.m_userInfo.vip
        cc.log("MainUI refPlayerView end")
    }

    //加入分享的房间号
    joinShareRoom() {
        if (g.User.InviteInfo.roomid != null) {
            cc.log("joinShareRoom")
            let data: any = {}
            data.roomid = g.User.InviteInfo.roomid;
            data.entertype = "join";
            g.Account.getRoomInfo(data)
        }
    }

    //统一管理大厅的按钮点击事件
    MainClicked(btn) {
        let name = btn.target.name
        cc.log("MainUI MainClicked btnname:" + name)
        switch (name) {
            case "btn_mail"://邮件
                this.showUIWindow(MainDef.WINS.MAIL)
                break;
            case "btn_share"://分享
                g.GlobalShare.share()
                break;
            case "btn_set"://游戏设置
                g.Manager.showGlobalUI(g.GlobalUI.TYPE_CREATE_SET)
                break;
            case "btn_rule"://游戏规则
                g.Manager.showGlobalUI(g.GlobalUI.TYPE_CREATE_RULE)
                break;
            case "btn_kefu"://客服
                this.showUIWindow(MainDef.WINS.KEFU)
                break;
            case "layer_user"://玩家信息
                this.showUIWindow(MainDef.WINS.PLAYERINFO)
                break;
            case "btn_bind"://绑定手机
                this.showUIWindow(MainDef.WINS.BINDPHONE)
                break;
            case "btn_shop": //商城
                g.Manager.showGlobalUI(g.GlobalUI.TYPE_CREATE_STORE)
                break;
            default:
                g.Dialog.show(g.Dialog.TYPE_TIP, "暂未开启")
                break;
        }
    }

    GameClicked(btn) {
        let name = btn.target.name
        cc.log("MainUI MainClicked btnname:" + name)
        switch (name) {
            case "btn_ershiyidian":
                //g.GameUtil.swithUI("Dian21", {type:"match"}, true, true)
                var data: any = {}
                data.gamename = "black_jack"
                data.entertype = "joingame";
                g.Account.siginEx(data);
                break;
            case "btn_qiangzhuangniuniu":
                //g.GameUtil.swithUI("Dian21", {type:"match"}, true, true)
                var data: any = {}
                data.gamename = "niuniu"
                data.entertype = "joingame";
                g.Account.siginEx(data);
                break;
                case "btn_domino":
                    g.GameUtil.swithUI(GameDef.GIDS.domino, {type:"match"}, true, true)
                    // var data: any = {}
                    // data.gamename = "black_jack"
                    // data.entertype = "joingame";
                    // g.Account.siginEx(data);
                    break;    
            default:
                g.Dialog.show(g.Dialog.TYPE_TIP, "暂未开启")
                break;
        }
    }

    //统一调度大厅里面窗口的弹出
    showUIWindow(winid, uidata = null) {
        g.ResLoader.showPrefab("Games/DaTing/Prefab/" + winid.fabname, this.mNodLayBoard, (node) => {
            cc.director.emit(winid.notify, uidata)
        }, true)
        switch (winid) {
        }
    }

    //统一调度大厅里面窗口的关闭
    closeUIWindow(winid, winNode, uidata = null) {
        if (cc.isValid(winNode)) {
            winNode.active = false
        }
        cc.log("MainUI closeUIWindow winid:" + winid)
        switch (winid) {
            case MainDef.WINS.MAIL:
                this.checkMailRedTip()
                break;
        }
        cc.director.emit("closeGameWindow", { winid: winid, data: uidata })
    }

    isUIWindowShow(winid) {
        let winNode = null
        switch (winid) {
            case MainDef.WINS.JOIN:
                // winNode = this.mNodJoinRoom
                break;
        }
        if (winNode) {
            return winNode.active
        }
        return false
    }

    //窗口关闭后如果有数据传递，逻辑处理可以在这里统一处理
    windowProcess(windata) {
        let winid = -1
        let params = null
        if (windata) {
            winid = windata.winid
            params = windata.data ? windata.data : {}
            cc.log("MainUI windowProcess winid=" + winid + " params=" + JSON.stringify(params))
            switch (winid) {

            }

        }
    }

    onMessage(event: string, args: any, id: number): void {
        function ad_call(gameid) {
            let uiData = {}     //传入参数
            uiData["ui"] = GameDef.mainScene
            uiData["type"] = "join"
            uiData["args"] = args
            g.GameUtil.swithUI(gameid, uiData, true)
        }

        if (args && event != "" && event.match("match.enter")) {
            g.Dialog.show(g.Dialog.TYPE_TIP, "比赛已开始，赶快加入吧!", null, 2)
            let data: any = {}
            data.gamename = GameDef.GNAMES[args.gameid].gamename;
            data.entertype = "match";
            data.matchdata = args
            g.Account.siginEx(data);
        } else {
            switch (event) {
                case "lobby.mail.redtip":
                    //this.mMailRedOp.active = (args.tip > 0)
                    break;
            }
        }

    }

    onError(code: number, event: string, message: string) {
        cc.log("MainUI onError event = " + event + ",message = " + message);
        if (event == "join" || (event && event.match("friend.join"))) {
            if (code == 3016) {
                if (this.isUIWindowShow(MainDef.WINS.JOIN)) {
                    //在加入房间的弹版里面报错才报
                    return false
                }
                //加入分享房间，房间号不存在不弹
                return true
            }
        } else if (event == "create") {
            g.NetSocket.send('signout', {}, true);
        }
    }

    ReloadConnect(event) {
        g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_SET)
        LocalDB.setInt(GameDef.AUTOLOGIN_TYPENAME, -1)
        g.Global.setData("AutoLG", false);
        g.Manager.changeUI(GameDef.startScene);
        g.NetSocket.release();
    }

    //邮件红点检测
    checkMailRedTip() {
        //g.NetSocket.send('lobby.mail.redtip', {}, false);
    }
}
