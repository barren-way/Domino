
let isNull = function (val) {
    if (val !== 0 && !val) {
        return true
    }
    return false
}

//数据存储接口
export default class LocalDB {
    //存储布尔变量数据
    public static setBool(_key, _value) {
        cc.sys.localStorage.setItem(_key, _value.toString())
    }

    public static getBool(_key, _default?) {
        let val = cc.sys.localStorage.getItem(_key)
        if (isNull(val)) {
            return _default
        }

        return val == "false" ? false : true
    }

    //存储int数据
    public static setInt(_key, _value) {
        cc.sys.localStorage.setItem(_key, _value.toString())
    }

    public static getInt(_key, _default?) {
        let val = cc.sys.localStorage.getItem(_key)
        if (isNull(val)) {
            return _default
        }
        return Number(val)
    }

    //存储字符串数据
    public static setString(_key, _value) {
        cc.sys.localStorage.setItem(_key, _value)
    }

    public static getString(_key, _default?) {
        let val = cc.sys.localStorage.getItem(_key)
        if (isNull(val)) {
            return _default
        }
        return val
    }

    //存储复杂的对象数据
    public static setObject(_key, _value) {
        cc.sys.localStorage.setItem(_key, JSON.stringify(_value))
    }

    public static getObject(_key, _default?) {
        let val = cc.sys.localStorage.getItem(_key)
        if (isNull(val)) {
            return _default
        }
        return JSON.parse(val)
    }

    public static set(_key, _value) {
        cc.sys.localStorage.setItem(_key, _value)
    }

    //检测指定key是否存在
    public static get(_key, _default?) {
        let val = cc.sys.localStorage.getItem(_key)
        if (isNull(val)) {
            return _default
        }
        return val
    }

    //删除指定key对应的数据
    public static remove(_key) {
        cc.sys.localStorage.removeItem(_key)
    }

    //清除所有key
    public static clear() {
        return cc.sys.localStorage.clear()
    }
}
