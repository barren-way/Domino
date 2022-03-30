import XlsxData from "./xlsx/XlsxData";
import { LangDef } from "./LangDef";
import XlsxDataManager from "./xlsx/XlsxDataManager";
import LocalDB from "../../../../Framework/Script/Engine/LocalDB";
import BundleManager from "../../../../Framework/Script/Engine/BundleManager";

//子游戏多语言管理器
export default class BDLangManager {
    private langName: string;
    private data: XlsxData;
    private static ins: BDLangManager;
    private m_bundleName = null;
    private m_bundleApp = null

    static getInstance(): BDLangManager {
        if (!this.ins) {
            this.ins = new BDLangManager();
        }
        return this.ins;
    }

    constructor() {
        
    }

    getBundleName() {
        return this.m_bundleName
    }

    getBundleApp() {
        return this.m_bundleApp
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
        cc.director.emit(LangDef.EVENTS.CHANGE_BD_LANG)
    }

    //切换到其他语言
    changeLang(name: string, callback?) {
        let lang = name
        let langFileName = this.m_bundleApp.getLangJsonName() + '_lang_' + lang;
        console.log("changeLang langFileName====" + langFileName)
        BundleManager.getInstance().loadRes(this.m_bundleName, "Lang/" + langFileName, cc.JsonAsset, (err, item: cc.JsonAsset) => {
            if (err) {
                if (callback) {
                    callback(LangDef.LANG_LOAD_FAIL)
                }
                return;
            }
            console.log('changeLang ok langFileName ', langFileName)
            // 2 添加数据到管理器
            XlsxDataManager.getInstance().addFile(item, langFileName)
            // 3 将语言数据添加到语言管理器
            BDLangManager.getInstance().setLang(lang, XlsxDataManager.getInstance().get(langFileName))
            if (callback) {
                callback(LangDef.LANG_LOAD_OK)
            }
        })
    }

    getLocalString(langID: string, opt?) {

        if (!this.data) {
            console.warn("BDLangManager is not init localString langID  ", langID, this.data);
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

    //加载Bundle多语言检测
    loadBundleLang(bundlename,callback?) {
        this.m_bundleName = bundlename
        console.log("loadBundleLang this.m_bundleName===" + this.m_bundleName)
        this.m_bundleApp = BundleManager.getInstance().getAppByBundleName(bundlename)

        let dataFileName = this.m_bundleApp.getLangJsonName() + '_info';
        console.log("loadBundleLang dataFileName====" + dataFileName)
        BundleManager.getInstance().loadRes(this.m_bundleName, 'Lang/' + dataFileName, cc.JsonAsset, (err, item: cc.JsonAsset) => {
            if (err) {
                if (callback) {
                    callback(LangDef.LANG_ENCODE_LOAD_FAIL)
                }
                return;
            }
            console.log(' loadBundleLang ok dataFileName ', dataFileName)

            //添加数据到管理器
            XlsxDataManager.getInstance().addFile(item)

            //设置默认使用语言
            let curLangName = LocalDB.get(LangDef.LOCAL_LANGNAME)
            console.log("curLangName===" + curLangName)
            if (curLangName) {
                this.changeLang(LangDef.LANGNAMES[curLangName])
            } else {
                this.changeLang(LangDef.LANGNAMES["zh-CN"])
            }
            if (callback) {
                callback(LangDef.LANG_LOAD_OK)
            }
        })
    }
}
