import { GameDef } from "./GameDef";
import { g } from "../../../Framework/Script/G";
import Tools from "./Tools";

const { ccclass, property } = cc._decorator;
@ccclass
export default class KeyBoard extends cc.Component {

    @property(cc.Node)
    mNodNumInput: cc.Node = null;//数字键盘输入

    @property(cc.Node)
    mNodAbcInput: cc.Node = null;//数字+字母键盘输入

    @property(cc.Label)
    mLabCase: cc.Label = null;//大小写提示

    private m_sceneScript = null;

    //数字键盘
    private m_inputArray = null
    private MOVE_DISY = 150
    private m_moveDisY = 0 //父节点往上偏移的像素
    private m_params = null

    private mLabsLetter = [];//字母
    private m_isLowerCase = false;//是否是小写字母
    private m_inputLen = 0 //输入的字符长度

    onLoad() {
        for (let i = 1; i <= 3; i++) {
            let linenode = cc.find("line" + i, this.mNodAbcInput)
            if (linenode) {
                let painodes = linenode.children
                for (let j = 0; j < painodes.length; j++) {
                    let tmplab = cc.find("img", painodes[j]).getComponent(cc.Label)
                    this.mLabsLetter.push(tmplab)
                }
            }
        }
    }

    onEnable() {
        this.m_sceneScript = g.Manager.getSceneScript()
        cc.director.on(GameDef.EVENTS.NOTIFY_SHOW_KEYBOARD, this.refWinData, this)
    }

    onDisable() {
        cc.director.off(GameDef.EVENTS.NOTIFY_SHOW_KEYBOARD, this.refWinData, this)
        if (cc.isValid(this.node)) {
            this.node.removeFromParent()
            this.node.destroy()
        }
    }

    refWinData(params) {
        this.m_params = params ? params : {}
        cc.log("KeyBoard this.m_params.number:" + this.m_params.number) //之前已输入的字符
        cc.log("KeyBoard this.m_params.movey:" + this.m_params.movey) //父节点做坐标偏移
        cc.log("KeyBoard this.m_params.numlen:" + this.m_params.numlen) //输入的字符长度控制
        cc.log("KeyBoard this.m_params.kbtype:" + this.m_params.kbtype) //打开的键盘类型
        cc.log("KeyBoard this.m_params.inputtype:" + this.m_params.inputtype) //输入的类型

        //设置数字键盘显示/数字+字母键盘显示
        this.mNodNumInput.active = this.m_params.kbtype == GameDef.KEYBOARD_TYPE_NUM
        this.mNodAbcInput.active = this.m_params.kbtype == GameDef.KEYBOARD_TYPE_ABC

        //设置默认的字符输入长度
        if (this.m_params.inputtype == GameDef.INPUT_TYPE_TEL) {
            this.m_inputLen = 11
        } else if (this.m_params.inputtype == GameDef.INPUT_TYPE_PASS) {
            this.m_inputLen = 6
        } else if (this.m_params.inputtype == GameDef.INPUT_TYPE_SMSCODE) {
            this.m_inputLen = 6
        } else {
            this.m_inputLen = this.m_params.numlen
        }


        this.m_moveDisY = this.m_params.movey ? this.m_params.movey : this.MOVE_DISY
        if (this.m_params.parentNode) {
            this.m_params.parentNode.runAction(cc.moveBy(0.25, cc.v2(0, this.m_moveDisY)))
        }

        if (this.m_params.number) {
            this.m_inputArray = []
            for (let i = 0; i < this.m_params.number.length; i++) {
                this.m_inputArray.push(this.m_params.number[i])
            }
        } else {
            this.ClearInput()
        }

        cc.log("this.m_inputArray===" + JSON.stringify(this.m_inputArray))

        if (this.mNodAbcInput.active) {
            this.m_isLowerCase = true
            this.mLabCase.string = "小写"
            this.mLabsLetter.forEach(v => {
                v.string = v.string.toLowerCase()
            })
        }

    }

    show() {

    }

    //数字输入
    NumInput(obj, eventdata) {
        if (this.m_inputArray.length < this.m_inputLen) {
            this.m_inputArray.push(eventdata)
            this.updateInput()
        }
    }

    //数字字母输入
    AbcInput(obj, eventdata) {
        let tmpdata = this.m_isLowerCase ? eventdata : eventdata.toUpperCase()
        if (this.m_inputArray.length < this.m_inputLen) {
            this.m_inputArray.push(tmpdata)
            this.updateInput()
        }
    }

    //重新输入
    ClearInput() {
        this.m_inputArray = []
        this.updateInput()
    }

    //删除
    DelInput() {
        Tools.removeAry(this.m_inputArray)
        this.updateInput()
    }

    //切换大小写
    CaseInput() {
        this.m_isLowerCase = !this.m_isLowerCase
        this.mLabCase.string = this.m_isLowerCase ? "小写" : "大写"
        this.mLabsLetter.forEach(v => {
            v.string = this.m_isLowerCase ? v.string.toLowerCase() : v.string.toUpperCase()
        })
    }

    updateInput() {
        if (this.m_params.callback) {
            this.m_params.callback(this.m_inputArray.toString().replace(/\,/g, ""))
        }
    }

    MainClicked(btn) {
        let name = btn.target.name
        cc.log("KeyBoard MainClicked btnname:" + name)
        switch (name) {
            case "btn_close":
            case "img_black":
                if (this.m_params.parentNode) {
                    this.m_params.parentNode.runAction(cc.moveBy(0.25, cc.v2(0, -this.m_moveDisY)))
                }
                this.node.active = false
                break;
        }
    }

}
