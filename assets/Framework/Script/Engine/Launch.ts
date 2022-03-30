import LangManager from "../../../Games/Common/Script/Lang/LangManager";
import Manager from "./Manager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Launch extends cc.Component {

    @property(cc.Node)
    launch: cc.Node = null;

    @property(cc.Node)
    root: cc.Node = null;

    @property(cc.JsonAsset)
    mJsonLang: cc.Node = null;

    private m_manager: Manager = null;

    onLoad() {
        this.m_manager = Manager.getInstance();
        this.m_manager.lanuch(this.root, this.launch);
        cc.view.enableAutoFullScreen(true);

        //设置大厅默认语言显示
        LangManager.getInstance().loadDatingLang()
    }

    start() {
        cc.game.addPersistRootNode(this.launch);
    }

    update(dt) {
        this.m_manager.process(dt);
        
    }
}
