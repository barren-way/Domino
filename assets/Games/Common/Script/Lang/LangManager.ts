import XlsxData from "./xlsx/XlsxData";
import { LangDef } from "./LangDef";
import XlsxDataManager from "./xlsx/XlsxDataManager";
import LocalDB from "../../../../Framework/Script/Engine/LocalDB";

//大厅多语言管理器
export default class LangManager {
    private langName: string;
    private data: XlsxData;
    private static ins: LangManager;

    static getInstance(): LangManager {
        if (!this.ins) {
            this.ins = new LangManager();
        }
        return this.ins;
    }

    constructor() {

    }

    getLang() {
        return this.langName;
    }

    clear(): void {
        this.data = null;
    }

    //设置当前语言
    setLang(langName: string, data: XlsxData) {
        if (this.langName == langName) {
            return;
        }
        this.data = data;
        this.langName = langName;
        cc.director.emit(LangDef.EVENTS.CHANGE_LANG)
    }

    //切换到其他语言
    changeLang(name: string, callback?) {
        let lang = name
        let langFileName = 'dating_lang_' + lang;
        cc.resources.load('Common/Lang/' + langFileName, cc.JsonAsset, (err, item: cc.JsonAsset) => {
            if (err) {
                if (callback) {
                    callback(LangDef.LANG_LOAD_FAIL)
                }
                return;
            }
            cc.log(' langFileName ', langFileName)
            // 2 添加数据到管理器
            XlsxDataManager.getInstance().addFile(item, langFileName)
            // 3 将语言数据添加到语言管理器
            LangManager.getInstance().setLang(lang, XlsxDataManager.getInstance().get(langFileName))
            if (callback) {
                callback(LangDef.LANG_LOAD_OK)
            }
        })
    }

    getLocalString(langID: string, opt?) {

        if (!this.data) {
            console.warn("LangManager is not init localString langID  ", langID, this.data);
            return langID;
        }
        let str: string = this.data.getValue(langID);
        if (str) {
            if (str.indexOf('\\') >= 0) {
                str = str.replace(/\\n/g, '\n');
            }
            if (opt) {
                for (const key in opt) {
                    let value = opt[key];
                    str = str.replace("%{" + key + "}", value);

                }
            }
        } else {
            str = langID;
        }
        return str;
    }

    //加载大厅多语言检测
    loadDatingLang(callback?) {
        let dataFileName = 'dating_info';
        cc.resources.load('Common/Lang/' + dataFileName, cc.JsonAsset, (err, item: cc.JsonAsset) => {
            if (err) {
                if (callback) {
                    callback(LangDef.LANG_ENCODE_LOAD_FAIL)
                }
                return;
            }
            cc.log(' dataFileName ', dataFileName)

            //添加数据到管理器
            XlsxDataManager.getInstance().addFile(item)

            //设置默认使用语言
            let curLangName = LocalDB.get(LangDef.LOCAL_LANGNAME)
            console.log("curLangName===" + curLangName)
            if (curLangName) {
                this.changeLang(LangDef.LANGNAMES[curLangName])
            } else {
                LocalDB.set(LangDef.LOCAL_LANGNAME,"zh-CN")
                this.changeLang(LangDef.LANGNAMES["zh-CN"])
            }

            if (callback) {
                callback(LangDef.LANG_LOAD_OK)
            }
        })
    }
}
