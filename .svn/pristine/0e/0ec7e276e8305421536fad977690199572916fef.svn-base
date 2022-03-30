
import XlsxDataManager from "../xlsx/XlsxDataManager";
import XlsxData from "../xlsx/XlsxData";
import BDLangManager from "../BDLangManager";

export default class BDText {
    //bundle自定义UI文本管理类
    private static ins: BDText;

    private uiData: XlsxData;

    constructor() {
        let tablename = BDLangManager.getInstance().getBundleApp().getLangTableName()
        this.uiData = XlsxDataManager.getInstance().get(tablename)
    }

    static getInstance() {
        if (!this.ins) {
            this.ins = new BDText()
        }
        return this.ins;
    }

    getText(id: any, opt?) {
        let content = this.uiData.getValue(id, 0);
        console.log('BDText content ', content)
        return BDLangManager.getInstance().getLocalString(content, opt)
    }
}
