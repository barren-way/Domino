const { ccclass, property } = cc._decorator;
@ccclass
export default class AssetsManager extends cc.Component {
    private static mInstance: AssetsManager = null;

    @property({
        type: cc.SpriteAtlas,
        displayName: "头像纹理",
    })
    private mSprAtlasHead: cc.SpriteAtlas = null


    @property({
        type: cc.SpriteAtlas,
        displayName: "货币纹理",
    })
    private mSprAtlasGoods: cc.SpriteAtlas = null

    @property({
        type: cc.Prefab,
        displayName: "数字键盘",
    })
    private mFabKeyBoard: cc.Prefab = null

    //游戏版本号
    @property({
        type: cc.JsonAsset,
        displayName: "游戏版本号",
    })
    private mJsonGameVer: cc.JsonAsset = null

    onLoad() {
        console.log("AssetManager onLoad start")
        AssetsManager.mInstance = this;
    }

    onDestroy() {
        AssetsManager.mInstance = null;
    }

    public static getInstance() {
        return AssetsManager.mInstance;
    }

    public getHeadSpriteFrame(name): cc.SpriteFrame {
        if (this.mSprAtlasHead) {
            return this.mSprAtlasHead.getSpriteFrame(name)
        }
    }
    public getGoodsSpriteFrame(name): cc.SpriteFrame {
        if (this.mSprAtlasGoods) {
            return this.mSprAtlasGoods.getSpriteFrame(name)
        }
    }

    public getKeyBoardFab() {
        return this.mFabKeyBoard
    }
    //获取webgame版本号
    public getWebGameVersion() {
        if (this.mJsonGameVer) {
            return this.mJsonGameVer.json.webgame
        }
    }
}
