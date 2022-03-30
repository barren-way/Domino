const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoExactFit extends cc.Component {
    //适配插件，场景里不用勾选fitHeight,fitWidth

    //适配方案(0:保留之前的方案,居中,1:宽高都根据高度拉伸,2:长边充满,3:全屏撑满)
    @property(cc.Integer)
    mFitVal: number = 1

    start() {
        let canvas = cc.find('Canvas').getComponent(cc.Canvas)
        let dsize = canvas["designResolution"] || cc.view.getDesignResolutionSize()
        let wsize = cc.winSize
        let fsize = cc.view.getFrameSize()
        if (this.mFitVal == 3 && cc.sys.isNative) {
            //全屏撑满，会有变形的情况，一般不采用
            canvas.fitHeight = true
            canvas.fitWidth = true
            canvas.node.scaleX = fsize.width / wsize.width
            canvas.node.scaleY = fsize.height / wsize.height
        } else if (this.mFitVal == 1 || this.mFitVal == 2) {
            //采用麒麟子的方案
            canvas.fitHeight = false
            canvas.fitWidth = false

            this.resize(canvas)

            //0、居中（居中其实不需要挂这个脚本，浪费效率）
            //1、宽高都根据高度拉伸
            //2、长边充满
            let dr = canvas["initDesignResolution"]

            let fitWidth = true;
            //如果更宽，则使用定高
            if ((fsize.width / fsize.height) > (dr.width / dr.height)) {
                fitWidth = false;
            }

            //自由缩放撑满
            if (this.mFitVal == 1) {
                if (fitWidth) {
                    canvas.node.height = canvas.node.width / fsize.width * fsize.height;
                }
                else {
                    canvas.node.width = canvas.node.height / fsize.height * fsize.width;
                }
                console.log("this.mFitVal == 1 this.node.width==" + canvas.node.width)
                console.log("this.mFitVal == 1 this.node.height==" + canvas.node.height)
            } else if (this.mFitVal == 2) {
                //保持等比缩放撑满
                if (fitWidth) {
                    //定宽表示设备更高了，则以高的缩放为准
                    let oldHeight = canvas.node.height;
                    canvas.node.height = canvas.node.width / fsize.width * fsize.height;
                    let scale = canvas.node.height / oldHeight;
                    canvas.node.width = scale * canvas.node.width;
                    console.log("this.mFitVal == 2 aaa this.node.width==" + canvas.node.width)
                    console.log("this.mFitVal == 2 aaa this.node.height==" + canvas.node.height)
                }
                else {
                    //定高表示设备更宽的，以宽的缩放为准
                    let oldWidth = canvas.node.width;
                    canvas.node.width = canvas.node.height / fsize.height * fsize.width;
                    let scale = canvas.node.width / oldWidth;
                    canvas.node.height = scale * canvas.node.height;
                    console.log("this.mFitVal == 2 bbb this.node.width==" + canvas.node.width)
                    console.log("this.mFitVal == 2 bbb this.node.height==" + canvas.node.height)
                }
            }
        } else {
            if (!canvas["initDesignResolution"]) {
                canvas["initDesignResolution"] = canvas.designResolution
            }
            let dr = canvas["initDesignResolution"]
            let s = cc.view.getFrameSize()
            let rw = s.width
            let rh = s.height
            let finalW = rw
            let finalH = rh

            if ((rw / rh) > (dr.width / dr.height)) {
                //!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
                canvas.fitHeight = true;

                //如果更长，则用定高
                finalH = dr.height
                finalW = finalH * rw / rh
            }
            else {
                /*!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
                canvas.fitWidth = true;
                //如果更短，则用定宽
                finalW = dr.width
                finalH = rh / rw * finalW
            }
            canvas.designResolution = cc.size(finalW, finalH)
            canvas.node.width = finalW
            canvas.node.height = finalH
        }

    }

    public resize(cvs) {
        //保存原始设计分辨率，供屏幕大小变化时使用
        if (!cvs.initDesignResolution) {
            cvs.initDesignResolution = cvs.designResolution
        }
        let dr = cvs.initDesignResolution
        let s = cc.view.getFrameSize()
        let rw = s.width
        let rh = s.height
        let finalW = rw
        let finalH = rh

        if ((rw / rh) > (dr.width / dr.height)) {
            //!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
            //cvs.fitHeight = true;

            //如果更长，则用定高
            finalH = dr.height
            finalW = finalH * rw / rh
        }
        else {
            /*!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
            //cvs.fitWidth = true;
            //如果更短，则用定宽
            finalW = dr.width
            finalH = rh / rw * finalW
        }
        cvs.designResolution = cc.size(finalW, finalH)
        cvs.node.width = finalW
        cvs.node.height = finalH
    }

    // update (dt) {}
}
