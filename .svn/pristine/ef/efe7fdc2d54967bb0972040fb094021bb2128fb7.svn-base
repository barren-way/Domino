import Dialog from "./Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipPop extends cc.Node {
    private static RESULT_OK = 0 //确定
    private static RESULT_CANCEL = 1 //取消
    //弹板类型
    public static TYPE_DIALOG_TIP = 0
    public static TYPE_DIALOG_TIP_S = 1
    public static TYPE_DIALOG_ONE_BTN = 2
    public static TYPE_DIALOG_TWO_BTN = 3
    public static TYPE_DIALOG_NET_TIMEOUT = 4
    public static TYPE_DIALOG_TWOPLUS_BTN = 5
    public static TYPE_DIALOG_INVITE = 6

    private static m_names = [
        "lay_tip",
        "lay_tip_s",
        "one_btn",
        "two_btn",
        "timeout",
        "twoplus_btn",
        "invite",
    ];

    private static mPrebInstance: cc.Prefab = null;
    protected m_timeHandler = null;
    protected m_type = null;
    protected m_result = null;
    protected m_isShow = null;
    protected m_info: string = null;
    protected m_pop = null;
    protected m_callBack = null;
    private mTag: number = null;

    set Tag(tag) {
        this.mTag = tag;
    }

    get Type() {
        return this.m_type;
    }

    public static createData(callBack?: Function) {
        if (!TipPop.mPrebInstance) {
            cc.resources.load("Common/Prefab/Dialog", function (err, prefab: cc.Prefab) {
                prefab.addRef()
                TipPop.mPrebInstance = prefab;
                if (callBack) {
                    callBack();
                }
            });
        }
    }

    public static releaseData() {
        if (TipPop.mPrebInstance) {
            TipPop.mPrebInstance.decRef()
            TipPop.mPrebInstance = null;
        }
    }

    public show(params) {
        this.m_type = params.dType
        let dname = TipPop.m_names[this.m_type];
        if (!dname) {
            return;
        }
        this.m_info = params.info ? params.info : ""
        this.m_info = this.m_info.replace("\\n", "\n")

        this.setContentSize(cc.view.getVisibleSize());
        let widget = this.addComponent(cc.Widget);
        widget.left = 0
        widget.right = 0
        widget.top = 0
        widget.bottom = 0
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE
        widget.updateAlignment()


        let ui = cc.instantiate(TipPop.mPrebInstance)
        if (!ui) {
            this.BTNClicked.bind(this, TipPop.RESULT_OK)
            return
        }
        this.addChild(ui)
        this.m_pop = ui.getChildByName(dname);
        this.m_pop.active = true
        this.m_callBack = params.callBack


        if (this.m_type == TipPop.TYPE_DIALOG_TIP) {
            let labInfo = cc.find("bg/txt", this.m_pop).getComponent("UILangComp");
            labInfo.setText("game_center_tip_" + this.m_info)
            let delay = params.delay ? params.delay : 1;
            cc.director.getScheduler().schedule(this.destroy2.bind(this), this, delay, 0, 0, false);
            cc.tween(this.m_pop).to(0.1, { scale: 1 }, { easing: 'backOut' }).start()
            ui.getChildByName("bg_d").active = false;
        }
        else if (this.m_type == TipPop.TYPE_DIALOG_TIP_S) {
            let labInfo = cc.find("txt", this.m_pop).getComponent(cc.Label);
            labInfo.string = this.m_info
            let delay = cc.delayTime(0.2);
            let fadeout = cc.fadeOut(1);
            let moveBy = cc.moveBy(1, cc.v2(0, 100));
            let spawn = cc.spawn(fadeout, moveBy);
            let callBack = cc.tween.call(this.destroy2.bind(this));
            cc.tween(this.m_pop).then(delay).then(spawn).then(callBack).start()
            ui.getChildByName("bg_d").active = false;
        }
        else if (this.m_type == TipPop.TYPE_DIALOG_ONE_BTN) {
            let labInfo = cc.find("txt", this.m_pop).getComponent("UILangComp");
            labInfo.setText("game_center_tip_" + this.m_info)
            let btnYes = cc.find("button", this.m_pop);
            btnYes.on(cc.Node.EventType.TOUCH_END, this.BTNClicked.bind(this, TipPop.RESULT_OK));
            this.doAction(this.m_pop,true)
        }
        else if (this.m_type == TipPop.TYPE_DIALOG_TWO_BTN) {
            let labInfo = cc.find("txt", this.m_pop).getComponent("UILangComp");
            labInfo.setText("game_center_tip_" + this.m_info)
            let btnYes = cc.find("button_1", this.m_pop);
            btnYes.on(cc.Node.EventType.TOUCH_END, this.BTNClicked.bind(this, TipPop.RESULT_OK));
            let btnNo = cc.find("button_2", this.m_pop);
            btnNo.on(cc.Node.EventType.TOUCH_END, this.BTNClicked.bind(this, TipPop.RESULT_CANCEL));
            this.doAction(this.m_pop,true)
        }
        else if (this.m_type == TipPop.TYPE_DIALOG_TWOPLUS_BTN) {
            let labInfo = cc.find("txt", this.m_pop).getComponent(cc.Label);
            labInfo.string = this.m_info;
            let btnYes = cc.find("button_1", this.m_pop);
            btnYes.on(cc.Node.EventType.TOUCH_END, this.BTNClicked.bind(this, TipPop.RESULT_OK));
            let btnNo = cc.find("button_2", this.m_pop);
            btnNo.on(cc.Node.EventType.TOUCH_END, this.BTNClicked.bind(this, TipPop.RESULT_CANCEL));
            this.doAction(this.m_pop,true)
        }
        else if (this.m_type == TipPop.TYPE_DIALOG_INVITE) {
            let labInfo = cc.find("txt", this.m_pop).getComponent("UILangComp");
            labInfo.setText("game_center_tip_" + this.m_info)
            let btnYes = cc.find("button_1", this.m_pop);
            btnYes.on(cc.Node.EventType.TOUCH_END, this.BTNClicked.bind(this, TipPop.RESULT_OK));
            let btnNo = cc.find("button_2", this.m_pop);
            btnNo.on(cc.Node.EventType.TOUCH_END, this.BTNClicked.bind(this, TipPop.RESULT_CANCEL));
            this.doAction(this.m_pop,true)
        }
        this.m_isShow = true
        return true;
    }

    public BTNClicked(result, event) {
        this.m_result = result;
        this.doAction(this.m_pop,false,this.destroy2.bind(this))
    }

    public destroy2() {
        Dialog.hide(this.mTag);
    }

    public hide(uncallback) {
        if (!this.m_isShow) return false;
        this.m_isShow = null;
        if (this.m_type == TipPop.TYPE_DIALOG_TIP || this.m_type == TipPop.TYPE_DIALOG_NET_TIMEOUT) {
            if (this.m_timeHandler != null) {
                cc.director.getScheduler().unschedule(this.m_timeHandler, this)
                this.m_timeHandler = null
            }
        }

        if (!uncallback && this.m_callBack) {
            this.m_callBack(this.m_result);
            this.m_callBack = null;
        }
        this.m_result = null;
        this.m_info = null;
        this.m_pop = null;
        this.removeFromParent();
        this.destroy();
        return true
    }

    private doAction(node, show, callback?) {
        if (cc.isValid(node)) {
            node.stopAllActions();
            if (show) {
                cc.tween(node)
                    .set({ scale: 0.2 })
                    .to(0.1, { scale: 1.1 })
                    .delay(0.02)
                    .to(0.05, { scale: 1.0 })
                    .call(callback)
                    .start()
            } else {
                cc.tween(node)
                    .to(0.1, { scale: 1.15 })
                    .to(0.05, { scale: 0 })
                    .call(callback)
                    .start()
            }

        }
    }
}
