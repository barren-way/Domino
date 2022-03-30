import { g } from "../G";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    //过场动画
    @property(cc.Animation)
    mLoadingLayer: cc.Animation = null;

    //联网时的菊花
    @property(cc.Animation)
    mJvHua: cc.Animation = null;

    // use this for initialization
    onLoad(): void {
        //g.loading = this;
        this.mLoadingLayer.node.active = false;
        this.mJvHua.node.active = false;
    }

    showLoading(): void {
        if (this.mLoadingLayer == null) {
            return;
        }
        this.mLoadingLayer.node.active = true;
        this.mLoadingLayer.play("uiopen");
    }

    hideLoading(): void {
        if (this.mLoadingLayer == null) {
            return;
        }
        this.mLoadingLayer.node.active = false;
        this.mLoadingLayer.play("uiclose");
    }

    showJvHua(): void {
        if (this.mJvHua == null) {
            return;
        }
        this.mJvHua.node.active = true;
        this.mJvHua.play("connin");
    }

    hideJvHua(): void {
        if (this.mJvHua == null) {
            return;
        }
        this.mJvHua.node.active = false;
    }
}
