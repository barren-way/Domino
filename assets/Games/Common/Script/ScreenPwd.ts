import { GameDef } from "./GameDef";
import Tools from "./Tools";
import LocalDB from "../../../Framework/Script/Engine/LocalDB";
import { cfg } from "./Config";
import SdkManager from "../../../Framework/Script/Sdk/SdkManager";
import User from "../../../Framework/Script/Data/User";

const { ccclass, property } = cc._decorator;
//屏蔽隐藏机关
@ccclass
export default class ScreenPwd extends cc.Component {

    @property(cc.Node)
    mNodInfo: cc.Node = null //需要显示的层

    @property(cc.Label)
    mLabInfo: cc.Label = null //显示的文字内容

    @property(cc.Label)
    mLabTip: cc.Label = null //提示信息

    private m_numList = [];

    private m_params = null;

    onEnable() {
        this.initData()
        cc.director.on(GameDef.EVENTS.NOTIFY_SCREENPWD_SHOW, this.refWinData, this)
    }

    onDisable() {
        cc.director.on(GameDef.EVENTS.NOTIFY_SCREENPWD_SHOW, this.refWinData, this)
    }

    refWinData(params) {
        this.m_params = params ? params : {}
    }

    initData() {
        this.m_numList = []
        this.mNodInfo.active = false
        this.mLabInfo.string = ""
        this.mLabTip.string = ""
    }

    MainClicked(btn, eventdata) {
        let name = btn.target.name
        cc.log("ScreenPwd MainClicked btnname:" + name)
        switch (name) {
            case "btn_copy":
                Tools.CopyStr(this.mLabInfo.string.toString())
                this.mLabTip.string = "复制成功!"
                setTimeout(() => {
                    this.mLabTip.string = ""
                }, 1000);
                break;
            case "btn_exit":
                this.initData()
                break;
        }
    }

    CircleClicked(btn, eventdata) {
        cc.log("ScreenPwd CircleClicked numid:" + eventdata)
        if (eventdata == "e") {
            this.initData()
            return
        }
        this.m_numList.push(eventdata)
        if (this.m_numList.length == 4) {
            let password = this.m_numList.toString().replace(/,/g, '')
            cc.log("password:" + password)
            if (password == "abcd") {
                this.mNodInfo.active = true
                let params
                if (this.m_params) {
                    if (this.m_params.hotupdate) {
                        params = {
                            gameid: GameDef.APP_GAMEID,
                            macid: LocalDB.getString(GameDef.LOCAL_MACID_KEY, ""),
                            device: cc.sys.os,
                            resVersion: LocalDB.getString(GameDef.LOCAL_VERSION_KEY, cfg.Version),
                            osVersion: cc.sys.osVersion
                        }
                    } else {
                        params = {
                            gameid: GameDef.APP_GAMEID,
                            macid: LocalDB.getString(GameDef.LOCAL_MACID_KEY, Tools.getRandMacId()),
                            resver: LocalDB.getString(GameDef.LOCAL_VERSION_KEY, cfg.Version),
                            apkver: SdkManager.getInstance().getAppVer(),
                            platform: SdkManager.getInstance().getPlatForm(),
                            device: cc.sys.os,
                            osVersion: cc.sys.osVersion,
                            token: User.getInstance().sid || ""
                        }
                    }
                }

                if (params) {
                    let exlist = []
                    for (const key in params) {
                        exlist.push(key + "=" + params[key])
                    }
                    this.mLabInfo.string = exlist.length > 0 ? exlist.toString().replace(/,/g, '&') : ""
                }
            }
        }
    }
}
