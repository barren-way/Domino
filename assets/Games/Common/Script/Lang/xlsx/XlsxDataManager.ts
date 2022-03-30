import Base64zh from "./Base64zh";
import XlsxData from "./XlsxData";
export enum XlsxType {
    DATA, //单独的数据
    TEMPLATE, //合并到一起的数据
    LANG,// 语言文本。
}
export default class XlsxDataManager {

    private static mInstance: XlsxDataManager = null;

    private dataMap = {};

    constructor() {

    }

    public static getInstance() {
        if (!XlsxDataManager.mInstance) {
            XlsxDataManager.mInstance = new XlsxDataManager();
        }
        return XlsxDataManager.mInstance;
    }

    addFile(res: any, fileName?: string) {
        if (!res) {
            console.log(" init file res is null", fileName)
            return;
        }
        console.log(' fileName ', fileName)
        console.log(" xslx manager add file res ==", res)
        let json = res.json ? res.json : res;
        if (json.isEncode) {
            json = this.decode(json.data)
        } else {
            json = json.data
        }
        console.log(" xslx manager add file json == ", json)
        if (json.type == XlsxType.TEMPLATE) {
            let room = json.data;
            for (const key in room) {
                if (!this.dataMap[key]) {
                    this.dataMap[key] = new XlsxData(room[key]);
                }
            }
        } else {
            if (fileName) {
                let key = fileName;
                if (fileName.indexOf('/') >= 0) {
                    key = fileName.match(/\/(\S*)\./)[1];
                }
                console.log(' add File key is ', key, " fileName ", fileName)
                if (!this.dataMap[key]) {
                    this.dataMap[key] = new XlsxData(json);
                }
            } else {
                console.error('不是合成表，fileName 不能为空 ')
            }

        }

    }

    decode(s: string) {
        var ins = Base64zh.decode(s)
        console.log('xlsxdata decode =========  ', ins)
        let resObj = JSON.parse(ins)
        return resObj
    }

    get(fileName: string): XlsxData {
        let key = fileName;
        if (fileName.indexOf('/') >= 0) {
            key = fileName.match(/\/(\S*)\./)[1];
        }
        let data = this.dataMap[key];
        if (!data) {
            console.error(' config error get fileName ', fileName, key)
            return null;
        }
        return data;
    }

    remove(fileName: string) {
        let key = fileName;
        if (fileName.indexOf('/') >= 0) {
            key = fileName.match(/\/(\S*)\./)[1];
        }
        let data = this.dataMap[key];
        if (data) {
            this.dataMap[key] = null
        }
    }

    getKey(fileName: string) {
        if (fileName.indexOf('/') >= 0) {
            let temp = fileName.split('/')
            if (temp.length == 2) {

            }
        } else {
            return fileName;
        }
    }



    clear() {
        this.dataMap = {};
    }

}
