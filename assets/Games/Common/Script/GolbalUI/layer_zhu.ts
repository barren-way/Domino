import { g } from "../../../../Framework/Script/G";
import { cfg } from '../../Script/Config'
import { GameDef } from '../GameDef';
import { MainDef } from '../../../Dating/Script/MainDef';
import LocalDB from '../../../../Framework/Script/Engine/LocalDB';
import { NetConfig } from "../../../../Framework/Script/Net/NetConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class layer_zhu extends cc.Component {

    @property(cc.Node)
    mNodBoard: cc.Node = null;//

    @property(cc.Label)
    mLabPhone: cc.Label = null;

    @property(cc.Label)
    mLabPass: cc.Label = null;

    @property(cc.Label)
    mLabQue: cc.Label = null;

    @property(cc.Label)
    mLabCode: cc.Label = null;

    @property(cc.Label)
    mLabGetCode: cc.Label = null;

    private m_smsTime = 60;
    private m_localtime = 0;

    private isBind = 0;

    private m_loginCallback = null;

    private m_params = null;

    onLoad() {

    }

    onEnable() {
        cc.director.on(GameDef.EVENTS.NOTIFY_PHONE_REG, this.refWinData, this)
    }

    onDisable() {
        cc.director.off(GameDef.EVENTS.NOTIFY_PHONE_REG, this.refWinData, this)
    }

    refWinData(params) {
        this.m_params = params ? params : {}
        cc.log("layer_zhu params:" + JSON.stringify(params))
        this.mLabPhone.string = GameDef.INPUT_STR_TEL
        this.mLabPass.string = GameDef.INPUT_STR_PASS
        this.mLabQue.string = GameDef.INPUT_STR_PASSQR
        this.mLabCode.string = GameDef.INPUT_STR_SMSCODE
        if (this.m_params.callback) {
            this.m_loginCallback = this.m_params.callback
        }
        this.inintCountDownShow()
    }

    update(dt) {
        if (this.m_smsTime <= 0) {
            return
        }
        //每秒更新显示信息        
        if (this.m_localtime >= 0) {
            this.m_localtime -= dt;
        } else {
            this.m_localtime = 1;
            this.countDownShow();
        }
    }

    //初始化倒计时界面
    inintCountDownShow() {
        this.m_smsTime = 0;
        this.m_localtime = 0;
        this.mLabGetCode.string = GameDef.INPUT_STR_GETCODE
    }

    //倒计时信息显示
    countDownShow() {
        this.m_smsTime = this.m_smsTime - 1

        let showtime = ""
        if (this.m_smsTime < 10) {
            showtime = "0" + this.m_smsTime;
        } else {
            showtime = String(this.m_smsTime)
        }

        this.mLabGetCode.string = showtime

        if (this.m_smsTime <= 0) {
            this.mLabGetCode.string = GameDef.INPUT_STR_GETCODE
        }
    }

    Close() {
        this.mLabPhone.string = ""
        this.mLabPass.string = ""
        this.mLabQue.string = ""
        this.mLabCode.string = ""

        if (this.isBind == 1) {
            //绑定手机
            this.node.parent.active = false
        }
        this.node.active = false
        this.isBind = 0
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

    updateQue(code) {
        this.m_params.quepass = code
        switch (code) {
            case GameDef.INPUT_STR_PASSQR:
            case "":
                code = GameDef.INPUT_STR_PASSQR
                break;
            default:
                code = g.GameUtil.stringConversionAsterisk(code)
                break;
        }
        this.mLabQue.string = code
    }

    updateCode(code) {
        this.mLabCode.string = code == "" ? GameDef.INPUT_STR_SMSCODE : code
    }


    MainClicked(btn) {
        let name = btn.target.name
        cc.log("WinBindPhone MainClicked btnname:" + name)
        switch (name) {
            case "btn_close":
                break;
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
            case "btn_que": //确认密码
                g.GameUtil.showKeyBoard(this.node, {
                    parentNode: this.mNodBoard,
                    inputtype: GameDef.INPUT_TYPE_PASS,
                    kbtype: GameDef.KEYBOARD_TYPE_ABC,
                    number: this.mLabQue.string != GameDef.INPUT_STR_PASSQR ? this.mLabQue.string : "",
                    callback: this.updateQue.bind(this)
                })
                break;
            case "btn_code": //输入验证码
                g.GameUtil.showKeyBoard(this.node, {
                    parentNode: this.mNodBoard,
                    inputtype: GameDef.INPUT_TYPE_SMSCODE,
                    kbtype: GameDef.KEYBOARD_TYPE_NUM,
                    number: !isNaN(Number(this.mLabCode.string)) ? this.mLabCode.string : "",
                    callback: this.updateCode.bind(this)
                })
                break;
            case "btn_getcode": //获取验证码
                {
                    if (this.m_smsTime > 0) {
                        return
                    }
                    let phone = this.mLabPhone.string
                    if (g.GameUtil.phoneVerify(phone)) {
                        g.NetHttp.send(g.NetModel.getUsHost() + cfg.smsServer, { phone: phone, token: g.User.sid }, this.NetResult.bind(this), "smsget");
                    }
                }
                break;
            case "btn_submit":
                {
                    let phone = this.mLabPhone.string
                    let pass = this.m_params.pass
                    let que = this.m_params.quepass
                    let code = this.mLabCode.string

                    if (g.GameUtil.phoneVerify(phone) && g.GameUtil.passVerify(pass) && g.GameUtil.pass2Verify(pass, que) && g.GameUtil.smscodeVerify(code)) {
                        if (this.isBind == 1) {
                            //绑定手机
                            g.Account.login(g.NetModel.getUsHost() + cfg.bindServer, { phone: phone, pass: pass, smscode: code, token: g.User.sid }, this.bindOver.bind(this));
                        } else {
                            g.Global.setData(GameDef.LOGIN_TYPENAME, GameDef.LOGIN_TEL);
                            LocalDB.setObject(GameDef.AUTOLOGIN_TELNUM, { phone: phone, pass: pass })
                            g.Account.login(g.NetModel.getUsHost() + cfg.signupSever, { phone: phone, pass: pass, smscode: code }, this.m_loginCallback);
                        }
                    }
                }
                break;
        }
    }

    NetResult(result: string, event, args) {
        cc.log("NetResult args:" + JSON.stringify(args))
        if (result == NetConfig.HttpResult.OK) {
            if (event == "smsget") { //发送短信验证码
                //倒计时
                this.m_smsTime = 60
                this.mLabGetCode.string = String(this.m_smsTime)
            }
        } else {
            if (args.message) {
                g.Dialog.show(g.Dialog.TYPE_TIP, args.message);
            }
        }
    }

    bindOver(data1, data2, data3) {
        if (data2.result == undefined) {
            if (data2 && data2.message && data2.message != undefined) {
                g.Dialog.show(g.Dialog.TYPE_TIP, data2.message);
            }
            return
        }
        if (data2.result.flag && data2.result.flag == 1) {
            g.Dialog.show(g.Dialog.TYPE_TIP, "绑定成功");
        }

        g.Player.setInfoBykey("phone", data2.result.phone)

        cc.director.emit(MainDef.EVENTS.NOTIFY_PLAYERINFO)

        this.Close()
    }

}
