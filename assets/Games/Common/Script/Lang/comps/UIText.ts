
import XlsxDataManager from "../xlsx/XlsxDataManager";
import XlsxData from "../xlsx/XlsxData";
import LangManager from "../LangManager";
import { LangDef } from "../LangDef";

export default class UIText {
    //大厅自定义UI文本管理类
    private static ins: UIText;

    private uiData: XlsxData;

    constructor() {
        this.uiData = XlsxDataManager.getInstance().get(LangDef.LANG_TABLENAME)
    }

    static getInstance() {
        if (!this.ins) {
            this.ins = new UIText()
        }
        return this.ins;
    }

    getText(id: any, opt?) {
        let content = this.uiData.getValue(id, 0);
        console.log('UIText content ', content)
        return LangManager.getInstance().getLocalString(content, opt)
    }
}
