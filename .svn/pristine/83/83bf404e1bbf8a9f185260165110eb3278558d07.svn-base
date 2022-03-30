import { XlsxType } from "./XlsxDataManager";

export default class XlsxData {

    private data: any[] = null;

    private keys: {} = null;

    //今后要支持多列索引
    private index: {} = null;

    private type: number = XlsxType.DATA;

    constructor(json) {
        if (json) {
            this.initWithJson(json);
        }
    }

    initWithJson(json) {
        this.data = json.data
        this.type = json.type;
        if (this.type == XlsxType.DATA) {
            this.keys = json.key;
            this.index = json.index;
        } else {

        }
    }

    size(): number {
        return this.data.length;
    }

    getData(): any[] {
        return this.data;
    }

    getKeys(): {} {
        return this.keys;
    }

    forEach(func: (key: string | number, value: any[]) => void) {
        for (const key in this.keys) {
            if (this.keys.hasOwnProperty(key)) {
                const element = this.keys[key];
                func(key, this.data[element])
            }
        }
    }
    getRowData(ID: any) {
        ID = "" + ID;
        let data = this.data[this.keys[ID]];
        if (data == undefined) {
            console.warn(' getRowData is null ', ID)
        }
        return data;
    }

    /**
     * 
     * @param ID 行ID
     * @param index 列索引位置
     */
    getValue(ID: any, index?: number) {
        ID = "" + ID;
        if (this.type == XlsxType.DATA && index != undefined) {
            let dIndex = this.keys[ID]
            if (dIndex >= 0) {
                let list = this.data[dIndex]
                if (list && list.length > index) {
                    return list[index];
                } else {
                    // console.warn(' index is out of range ', index, ' id ', ID)
                }
            } else {
                console.warn(' dIndex is wrong ', dIndex, ' id is ', ID)
            }

        } else {
            return this.data[ID];
        }
    }

    /**
     * 拷贝数值 必须是数组类型
     * @param ID 
     * @param index 
     */
    copyValue(ID: any, index?: number) {
        let list = [];
        let value: any[] = this.getValue(ID, index);
        if (value) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index];
                list.push(element)
            }
        }
        return list;
    }

    getIndex(enumValue: number) {
        let key = '' + enumValue
        return this.index[key];
    }

    // getIndexByLineID(lineID: string): any[] {
    //     return this.index[lineID];
    // }
    /**
     * 获取索引列的值对应的id列表
     * @param indexID 索引列的值
     */
    getIndexByID(enumValue, value): any[] {
        let key = '' + enumValue
        // console.log(' enumValue, value ',key, value)
        // console.log('getIndexByID  this.index  ',this.index)
        if (this.index[key] && this.index[key][value]) {
            return this.index[key][value]
        }
        return []
    }

    /**
     * 返回拷贝的索引id列表
     * @param enmuValue 
     * @param lineID 
     */
    copyIndex(enmuValue: number, lineID: string): any[] {
        let temp: any[] = []
        let list = this.getIndexByID(enmuValue, lineID);
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                temp.push(element)
            }
        }
        return temp;
    }


}
