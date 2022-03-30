import Tools from "../../../Games/Common/Script/Tools";

export default class Player {
    private static mInstance: Player = null;
    private m_info: any = null; //玩家属性数据
    private m_items: any = null; //玩家道具数据

    public static getInstance() {
        if (!Player.mInstance) {
            Player.mInstance = new Player();
        }
        return Player.mInstance;
    }

    release() {
        this.m_info = null;
    }

    setInfo(info) {
        //玩家数据
        if (!this.m_info) {
            this.m_info = {}
        }
        if (info.user) {
            this.m_info = info.user
        }

        //道具
        if (!this.m_items) {
            this.m_items = {}
        }

        if (info.items) {
            //改造一下items,变成kv格式的
            let map = {}
            for (let i = 0; i < info.items.length; i++) {
                const v = info.items[i];
                map[v.itemid] = { itemn: v.itemn, state: v.state }
            }
            this.m_items = map
        }

    }

    dealVip() {
        let curtime = Tools.getTimeSecs()
        if (this.m_info) {
            if (this.m_info.viptime <= 0) {
                this.m_info["vip"] = false
            } else {
                this.m_info["vip"] = ((curtime - this.m_info.viptime) < 0)
            }
        }
    }

    isInit() {
        return this.m_info != null;
    }

    getInfoBykey(key) {
        if (this.m_info) {
            return this.m_info[key];
        }
    }

    getAllInfo() {
        if (this.m_info) {
            return this.m_info;
        }
    }

    setInfoBykey(key, val) {
        console.log("setInfoBykey===============")
        if (!this.m_info) {
            this.m_info = {}
        }
        this.m_info[key] = val;
    }

    updateInfoByKey(k, v, add?) {
        if (this.m_info[k] || add) {
            this.m_info[k] = Math.max(0, this.m_info[k] + v)
        } else {
            this.m_info[k] = v
        }
        return this.m_info[k]
    }

    updateInfo(info) {
        console.log("updateInfo===============" + JSON.stringify(info))
        if (this.m_info) {
            for (let k in info) {
                if (this.m_info[k] != null) {
                    this.m_info[k] = info[k]
                }
            }
        }
        this.dealVip()
    }

    setItems(items) {
        let map = {}
        for (let i = 0; i < items.length; i++) {
            const v = items[i];
            map[v.itemid] = { itemn: v.itemn, state: v.state }
        }
        this.m_items = items
    }

    updateItems(items, add) {
        if (Object.prototype.toString.call(items) == '[object Array]') {
            items.forEach(it => {
                if (add && !this.m_items[it.itemid]) {
                    this.m_items[it.itemid] = {}
                }
                if (this.m_items[it.itemid]) {
                    for (const key in it) {
                        if (it.hasOwnProperty(key)) {
                            this.m_items[it.itemid][key] = it[key]
                        }
                    }
                }
            });
        }
    }

    setItemByKey(id, k, v) {
        if (!this.m_items[id]) {
            this.m_items[id] = {}
        }
        this.m_items[id][k] = v
        return v
    }

    updateItemByKey(id, k, v) {
        if (!this.m_items[id]) {
            this.m_items[id] = {}
            this.m_items[id][k] = v
        } else {
            this.m_items[id][k] = Math.max(0, this.m_items[id][k] + v)
        }
    }

    getItemByKey(id, k, _default?) {
        return this.m_items[id] ? this.m_items[id][k] : _default
    }

    getItem(id) {
        return this.m_items[id]
    }

    getItems() {
        return this.m_items
    }
}
