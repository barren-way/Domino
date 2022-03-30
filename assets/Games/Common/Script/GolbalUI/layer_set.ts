import { g } from "../../../../Framework/Script/G";
import { GameDef } from "../GameDef";
import LocalDB from "../../../../Framework/Script/Engine/LocalDB";
import SysUtil from "../SysUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Setting extends cc.Component {

    @property(cc.Node)
    private mNodLayFull: cc.Node = null;
    //全屏开
    @property(cc.Node)
    private mNodFullOn: cc.Node = null;
    //全屏关
    @property(cc.Node)
    private mNodFullOff: cc.Node = null;

    //音乐开
    @property(cc.Node)
    private mNodMusicOn: cc.Node = null;
    //音乐关
    @property(cc.Node)
    private mNodMusicOff: cc.Node = null;

    //音效开
    @property(cc.Node)
    private mNodAudioOn: cc.Node = null;
    //音效关
    @property(cc.Node)
    private mNodAudioOff: cc.Node = null;

    @property(cc.Label)
    private mLabLogOut: cc.Label = null;//切换账号/注销账号


    @property(cc.Node)
    private mNodSetNormal: cc.Node = null; //普通设置
    @property(cc.Node)
    private mNodSetDdz: cc.Node = null; //斗地主设置
    @property(cc.Node)
    private mNodSetTdh: cc.Node = null; //斗地主设置

    @property(cc.Node)
    private mNodDdzExitRoom: cc.Node = null; //斗地主退出房间
    @property(cc.Node)
    private mNodDdzDisRoom: cc.Node = null; //斗地主解散房间


    @property(cc.Node)
    private mNodTdhExitRoom: cc.Node = null; //推倒胡退出房间
    @property(cc.Node)
    private mNodTdhDisRoom: cc.Node = null; //推倒胡解散房间

    private m_autoFullScreen = 0

    private m_sceneName = null

    private mParams = null;

    onload() {

    }

    start() {

    }

    show(params) {
        this.mParams = params || {}
        let musicVol = g.AudioMgr.getMusicVolume()
        let audioVal = g.AudioMgr.getSoundVolume()
        this.mNodMusicOn.active = musicVol > 0
        this.mNodMusicOff.active = musicVol == 0
        this.mNodAudioOn.active = audioVal > 0
        this.mNodAudioOff.active = audioVal == 0

        this.mLabLogOut.string = "切换账号"

        //自动全屏设置
        this.mNodLayFull.active = !cc.sys.isNative
        this.m_autoFullScreen = LocalDB.getInt(GameDef.AUTOFULLSCREEN, 0)
        this.mNodFullOn.active = this.m_autoFullScreen > 0
        this.mNodFullOff.active = this.m_autoFullScreen == 0

        this.m_sceneName = g.Manager.getSceneName()
        this.mNodSetNormal.active = this.m_sceneName == GameDef.mainScene
        this.mNodSetDdz.active = this.mParams.isddz
        this.mNodSetTdh.active = this.mParams.ismj
        this.mNodDdzExitRoom.active = false
        this.mNodDdzDisRoom.active = false
        this.mNodTdhExitRoom.active = false
        this.mNodTdhDisRoom.active = false

        setTimeout(() => {
            if (this.node && this.node.active) {
                if (this.mNodSetDdz.active) {
                    this.mNodDdzExitRoom.active = this.mParams.quit
                    this.mNodDdzDisRoom.active = this.mParams.dismiss
                }
                if (this.mNodSetTdh.active) {
                    this.mNodTdhExitRoom.active = this.mParams.quit
                    this.mNodTdhDisRoom.active = this.mParams.dismiss
                }
            }
        }, 1);

    }

    MainBtnClicked(btn) {
        let name = btn.target.name
        switch (name) {
            case "btn_close":
                g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_SET)
                break;
            case "btn_opengps":
                {
                    if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                        //安卓平台
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Sdk_Event", "openGPS", "()V")
                    } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                        //IOS平台
                    }
                }
                break;
            case "btn_exitroom":
                if (this.mParams && this.mParams.callback) {
                    g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_SET)
                    this.mParams.callback("quit")
                }
                break;
            case "btn_disroom":
                if (this.mParams && this.mParams.callback) {
                    g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_SET)
                    this.mParams.callback("dismiss")
                }
                break;
            case "btn_qiehuan":
                g.Manager.hideGlobalUI(g.GlobalUI.TYPE_CREATE_SET)
                LocalDB.setInt(GameDef.AUTOLOGIN_TYPENAME, -1)
                g.Global.setData("AutoLG", false);
                g.Manager.changeUI(GameDef.startScene, { delToken: true });
                g.NetSocket.release();
                break;
        }
    }

    public MusicClicked(btn, eventdata) {
        let name = btn.target.name
        cc.log("layer_set MusicClicked btnname:" + name)
        this.mNodMusicOn.active = eventdata == "off"
        this.mNodMusicOff.active = eventdata == "on"
        g.AudioMgr.switchMusic(eventdata == "off")
    }

    public AudioClicked(btn, eventdata) {
        let name = btn.target.name
        cc.log("layer_set AudioClicked btnname:" + name)
        this.mNodAudioOn.active = eventdata == "off"
        this.mNodAudioOff.active = eventdata == "on"
        g.AudioMgr.switchSound(eventdata == "off")
    }

    public FullClicked(btn, eventdata) {
        let name = btn.target.name
        cc.log("layer_set FullClicked btnname:" + name)
        this.mNodFullOn.active = eventdata == "off"
        this.mNodFullOff.active = eventdata == "on"
        this.m_autoFullScreen = this.mNodFullOn.active ? 1 : 0
        LocalDB.setInt(GameDef.AUTOFULLSCREEN, this.m_autoFullScreen)
        if (this.m_autoFullScreen == 1) {
            SysUtil.launchFullscreen()
        } else {
            SysUtil.exitFullscreen()
        }
    }

    public MajiangBgClicked(toggle) {
        let name = toggle.target.name
        cc.log("layer_set MajiangBgClicked btnname:" + name)
        if (toggle._pressed && toggle.isChecked) {
            // let tmpdata = name.match(/toggle(\d+)/)
            // if (tmpdata && tmpdata[1]) {
            //     LocalDB.setInt(MJDef.MJ_DESKBG_IDX, tmpdata[1])
            //     if (this.mParams && this.mParams.callback) {
            //         this.mParams.callback("changedesk")
            //     }
            // }
        }
    }

    public MajiangBeiClicked(toggle) {
        let name = toggle.target.name
        cc.log("layer_set MajiangBeiClicked btnname:" + name)
        if (toggle._pressed && toggle.isChecked) {
            // let tmpdata = name.match(/toggle(\d+)/)
            // if (tmpdata && tmpdata[1]) {
            //     LocalDB.setInt(MJDef.MJ_PAIBEI_IDX, tmpdata[1])
            //     if (this.mParams && this.mParams.callback) {
            //         this.mParams.callback("changepaibei")
            //     }
            // }
        }
    }

    public PdkBgClicked(toggle) {
        let name = toggle.target.name
        cc.log("layer_set PdkBgClicked btnname:" + name)
        if (toggle._pressed && toggle.isChecked) {
            // let tmpdata = name.match(/toggle(\d+)/)
            // if (tmpdata && tmpdata[1]) {
            //     //LocalDB.setInt(PDKDef.PDK_DESKBG_IDX, tmpdata[1])
            //     if (this.mParams && this.mParams.callback) {
            //         this.mParams.callback("changedesk")
            //     }
            // }
        }
    }
}



