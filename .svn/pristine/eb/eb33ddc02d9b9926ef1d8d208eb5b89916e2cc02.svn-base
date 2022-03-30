import { g } from "../../../../Framework/Script/G";
import { cfg } from '../../Script/Config'
import { GameDef } from "../GameDef";
import LocalDB from "../../../../Framework/Script/Engine/LocalDB";

const { ccclass, property } = cc._decorator;


@ccclass
export default class layer_phone extends cc.Component {

    @property(cc.Node)
    mNodBoard: cc.Node = null;//

    @property(cc.Node)
    mNodReg: cc.Node = null;//手机注册弹版

    @property(cc.Node)
    mNodWang: cc.Node = null;//忘记密码弹版

    @property(cc.Label)
    mLabPhone: cc.Label = null; //输入的手机号

    @property(cc.Label)
    mLabPass: cc.Label = null; //输入的密码

    private isBind = 0;

    private m_loginCallback = null;

    private m_params = null;

    onLoad() {

    }

    onDestroy() {

    }


    start() {

    }

    onEnable() {
        cc.director.on(GameDef.EVENTS.NOTIFY_PHONE_LOGIN, this.refWinData, this)
    }

    onDisable() {
        cc.director.off(GameDef.EVENTS.NOTIFY_PHONE_LOGIN, this.refWinData, this)
    }

    refWinData(params) {
        this.m_params = params ? params : {}
        cc.log("layer_phone params:" + JSON.stringify(params))
        //拉取本底储存值
        let phonedata = LocalDB.getObject(GameDef.AUTOLOGIN_TELNUM)
        //独立定义密码
        if (phonedata) {
            this.m_params.pass = phonedata.pass
            this.updatePhone(phonedata.phone)
            this.updatePass(phonedata.pass)
        }
        if (this.m_params.callback) {
            this.m_loginCallback = this.m_params.callback
        }
        this.show()
    }

    show() {
        this.mNodReg.active = false
        this.mNodWang.active = false
        if (this.m_params.bindtype == 1) {
            //绑定手机
            this.isBind = 1
            this.node.getChildByName("zhu").getComponent("layer_zhu").show({ bindtype: 1 })
        }
    }

    updatePhone(phone) {
        this.mLabPhone.string = phone == "" ? GameDef.INPUT_STR_TEL : phone
    }

    updatePass(code) {
        this.m_params.pass = code
        switch (code) {
            case GameDef.INPUT_STR_PASS:
            case "":
                code = GameDef.INPUT_STR_PASS
                break;
            default:
                code = g.GameUtil.stringConversionAsterisk(code)
                break;
        }
        this.mLabPass.string = code
    }

    MainClicked(btn) {
        let name = btn.target.name
        cc.log("layer_phone MainClicked btnname:" + name)
        switch (name) {
            case "btn_phone"://输入手机号
                g.GameUtil.showKeyBoard(this.node, {
                    parentNode: this.mNodBoard,
                    inputtype: GameDef.INPUT_TYPE_TEL,
                    kbtype: GameDef.KEYBOARD_TYPE_NUM,
                    number: !isNaN(Number(this.mLabPhone.string)) ? this.mLabPhone.string : "",
                    callback: this.updatePhone.bind(this)
                })
                break;
            case "btn_pass": //输入密码
                g.GameUtil.showKeyBoard(this.node, {
                    parentNode: this.mNodBoard,
                    inputtype: GameDef.INPUT_TYPE_PASS,
                    kbtype: GameDef.KEYBOARD_TYPE_ABC,
                    number: this.mLabPass.string != GameDef.INPUT_STR_PASS ? this.mLabPass.string : "",
                    callback: this.updatePass.bind(this)
                })
                break;
            case "btn_login": //登陆
                {
                    let phone = this.mLabPhone.string
                    let pass = this.m_params.pass

                    if (g.GameUtil.phoneVerify(phone) && g.GameUtil.passVerify(pass)) {
                        g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_TEL);
                        LocalDB.setObject(GameDef.AUTOLOGIN_TELNUM, { phone: phone, pass: pass })
                        g.Account.login(g.NetModel.getUsHost() + cfg.uServer, { name: phone, pass: pass }, this.m_loginCallback);
                    }
                }
                break;
            case "btn_wang": //忘记密码
                this.mNodWang.active = true
                cc.director.emit(GameDef.EVENTS.NOTIFY_PHONE_WANG)
                break;
            case "btn_zhu": //注册
                this.node.getChildByName("zhu").getComponent("layer_zhu").show(this.m_loginCallback)
                break;
            case "btn_close":
                this.mLabPhone.string = ""
                this.mLabPass.string = ""
                this.node.active = false
                break;
        }
    }

}
