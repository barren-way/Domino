//截屏
const { ccclass, property } = cc._decorator;
@ccclass
export default class TextureRenderUtils extends cc.Component {

    //截屏使用的的摄像机
    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Label)
    label: cc.Label = null;

    //需要使用canvas创建图片时使用的。
    private _canvas: any = null;
    //截屏取的节点
    private screenShotNode: cc.Node = null;
    //取屏幕像素点颜色使用。
    private texture: cc.RenderTexture;

    onLoad() {

    }

    onDestroy() {
        this.uninit()        
    }

    public uninit() {
        if (this.screenShotNode) {
            this.screenShotNode.parent = null;
            this.screenShotNode.destroy()
        }
    }

    private init() {
        //this.label.string = '长按截图保存到手机';
        if (this.texture) {
            this.texture.destroy()
        }

        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.winSize.width, cc.winSize.height, cc['gfx'].RB_FMT_S8);
        this.camera.targetTexture = texture;
        this.texture = texture;

        if (this.screenShotNode) {
            this.screenShotNode.width = cc.winSize.width;
            this.screenShotNode.height = cc.winSize.height;
            
            return;
        }

        let node = new cc.Node();
        node.zIndex = cc.macro.MAX_ZINDEX;
        node.parent = cc.director.getScene();

        node.width = cc.winSize.width;
        node.height = cc.winSize.height;

        let width = cc.winSize.width;
        let height = cc.winSize.height;
        node.x = width / 2;
        node.y = height / 2;

        node.addComponent(cc.BlockInputEvents);
        node.on(cc.Node.EventType.TOUCH_START, () => {
            let gameDiv = document.getElementById('Cocos2dGameContainer');
            let qrCode = document.getElementById('QRCode');
            if (qrCode) {
                gameDiv.removeChild(qrCode)
            }

            node.active = false;

        });
        this.screenShotNode = node;
        this.screenShotNode.active = false;
    }

    // create the img element
    private initImage() {
        // return the type and dataUrl
        let dataURL = this._canvas.toDataURL("image/jpg");
        let img = document.createElement("img");
        img.src = dataURL;
        return img;
    }

    // create the canvas and context, filpY the image Data
    private createSprite() {
        let width = this.texture.width;
        let height = this.texture.height;
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');

            this._canvas.width = width;
            this._canvas.height = height;
        }
        else {
            this.clearCanvas();
        }
        let ctx = this._canvas.getContext('2d');
        this.camera.render();
        let data = this.texture.readPixels();
        // write the render data
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        return this._canvas;
    }

    private clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }


    public screenShot() {
        //1
        this.init();
        this.createSprite();
        let bigImg = this.initImage();
        
        //2
        let gameDiv = document.getElementById('Cocos2dGameContainer');
        bigImg.id = 'QRCode';
        bigImg.alt = 'bigImg';

        bigImg.width = parseInt(gameDiv.style.width.replace(/px/, '')) * 0.5;
        bigImg.height = parseInt(gameDiv.style.height.replace(/px/, '')) * 0.5;

        //bigImg.width = gameDiv.style.width.replace(/px/, '');
        //bigImg.height = gameDiv.style.height.replace(/px/, '');

        bigImg.style.position = 'absolute';

        bigImg.style.top = parseInt(gameDiv.style.height.replace(/px/, '')) / 2 - bigImg.height / 2 + "px";//y坐标
        bigImg.style.left = parseInt(gameDiv.style.width.replace(/px/, '')) / 2 - bigImg.width / 2 + "px";//设置图片居中显示
        gameDiv.appendChild(bigImg);

        this.screenShotNode.active = true;

    }
}
