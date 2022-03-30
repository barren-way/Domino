import MD5 from "../../../Framework/Script/Engine/md5";
import sdk from "../../../Framework/Script/Sdk/SdkManager";

//全局调用的接口
const { ccclass, property } = cc._decorator;
@ccclass
export default class Tools {

    private static m_tmpDate = new Date()
    private static m_curDate = new Date()

    private static _htmlspecialchars_set = { "\"": "&quot;", "'": "&#039;", "<": "&lt;", ">": "&gt;" }

    //安全方法调用
    public static SafeCallFunc(_class, funcname, param1?, param2?, param3?) {
        if (_class == null) return
        if (funcname == null) return
        if (_class[funcname] == null) return
        return _class[funcname](param1, param2, param3)
    }

    //数组排序，默认升序排列
    public static sortAry(arrays, isdown = false) {
        arrays.sort(function (a, b) {
            if (isdown) {
                return b - a
            }
            return a - b
        })
    }
    //获取数组keys
    public static getAryKeys(arrays) {
        let arrayKeys = []
        for (const key in arrays) {
            arrayKeys[arrayKeys.length] = key
        }
        return arrayKeys
    }

    //获取数组values
    public static getAryValues(arrays) {
        let arrayVals = []
        for (const val of arrays) {
            arrayVals[arrayVals.length] = val
        }
        return arrayVals
    }

    //删除数组指定位置元素并返回，默认删除最后一个
    public static removeAry(arrays, index = null) {
        //arr.shift()删除并且返回第一个元素
        //arr.pop()删除并且返回最后一个元素
        if (arrays && arrays.length > 0) {
            if (index != null && index > -1) {
                let result = arrays.splice(index, 1)
                return result[0]
            }
            return arrays.pop()
        }
    }
    //数组指定位置添加元素并返回，默认添加到最后
    public static insertAry(arrays, val, index = null) {
        //arr.unshift('one')在数组开头添加一个或者多个元素，返回数组新长度
        //arr.push('end')在数组尾部添加一个或者多个元素，返回数组新长度
        if (arrays) {
            if (index != null && index > -1) {
                arrays.splice(index, 0, val);
                return
            }
            arrays.push(val)
        }
    }

    //获取某个数以内的随机数
    public static getRandom(max, min = 1) {
        let r = Math.floor(Math.random() * 10000)
        return r % ((max + 1) - min) + min
        //return Math.floor(Math.random()*(max-min)+min)
    }

    //获取不重复的N位随机数
    public static getRandom2(bitn) {
        let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        let count = 0
        let result = []
        while (count < bitn) {
            let max = nums.length
            let randidx = Tools.getRandom(max)
            let tmpnum = nums[randidx - 1]
            let ok = true
            if (count == 0 && tmpnum == 0) {
                ok = false
            }
            if (ok) {
                result[count] = nums[randidx - 1]
                nums.splice(randidx - 1, 1)
                count = count + 1
            }
        }
        let randnum = 0
        for (let i = 0; i < result.length; i++) {
            randnum = randnum + result[i] * Math.pow(10, bitn - i - 1)
        }
        return randnum
    }
    //克隆
    public static clone(data: any): any {
        let _clone = function (obj) {
            let copy
            switch (typeof obj) {
                case 'undefined':
                    break;
                case 'number':
                case 'string':
                case 'boolean':
                case 'function':
                    copy = obj;
                    break;
                case 'object':
                    {
                        if (obj == null) {
                            copy = null;
                        } else if (Object.prototype.toString.call(obj) === '[object Array]') {
                            copy = [];
                            for (let i in obj) {
                                copy.push(_clone(obj[i]));
                            }
                        } else if (Object.prototype.toString.call(obj) === '[object RegExp]') {
                            copy = obj;
                        } else {
                            copy = {};
                            for (let j in obj) {
                                copy[j] = _clone(obj[j]);
                            }
                        }
                        break
                    }
            }
            return copy
        }
        return _clone(data);
    }
    //判断是不是一个number
    public static isNumber(val) {
        if (val != null) {
            return typeof (val) == 'number'
        }
        return false
    }
    //判断是不是一个string
    public static isString(val) {
        if (val != null) {
            return typeof (val) == 'string'
        }
        return false
    }
    //判断是不是一个标号从0开始的数组[]
    public static isArray(array) {
        if (array != null) {
            return Object.prototype.toString.call(array) == '[object Array]'
        }
        return false
    }
    //判断是不是一个kv数组{}
    public static isMap(array) {
        let arrayKeys = []
        if (array != null) {
            if (Object.prototype.toString.call(array) == '[object Object]') {
                for (const key in array) {
                    arrayKeys[arrayKeys.length] = key
                    if (arrayKeys.length > 0) {
                        break
                    }
                }
            }
        }
        return arrayKeys.length > 0
    }
    //计算字符串长度
    public static strlen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1 
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }
        return len;
    }
    //判断小数点后有几位
    public static getFloatNum(num) {
        let x = String(num).indexOf('.') + 1 //小数点的位置
        let y = 0
        if (x > 0) {
            y = String(num).length - x //小数的位数
        }
        cc.log("getFloatNum:" + y)
        return y
    }
    //转换日期格式，默认:yyyy-MM-dd HH:mm:ss,苹果:yyyy/MM/dd HH:mm:ss
    public static formatDate(datestr) {
        let newdatestr = datestr
        if (cc.sys.os == cc.sys.OS_IOS) {
            cc.log("replace datestr1")
            newdatestr = datestr.replace(/\-/g, '/')
        }
        cc.log("newdatestr==" + newdatestr)
        return newdatestr
    }
    //将毫秒数转化为 天, 时,分,秒
    public static converTime(millis) {
        let totalSeconds = millis / 1000
        let second = totalSeconds % 60 // 秒
        let totalMinutes = totalSeconds / 60
        let minute = totalMinutes % 60 // 分
        let totalHours = totalMinutes / 60
        let hour = totalHours % 24 // 时
        let totalDays = totalHours / 24
        let array = {}
        array["d"] = Math.floor(totalDays)
        array["h"] = Math.floor(hour)
        array["m"] = Math.floor(minute)
        array["s"] = Math.floor(second)
        return array
    }

    //将秒数转化为 时,分,秒 (超过24小时部分转化为天数并舍弃掉)
    public static converTimeBySec(sec) {
        return this.converTime(sec * 1000)
    }

    //将秒数转化为 时,分,秒 (小时 时间不会转化为 天数 )
    public static converTimerToHour(sec) {
        let totalSeconds = sec
        let second = totalSeconds % 60 // 秒
        let totalMinutes = totalSeconds / 60
        let minute = totalMinutes % 60 // 分
        let totalHours = totalMinutes / 60
        let array = {}
        array["h"] = Math.floor(totalHours)
        array["m"] = Math.floor(minute)
        array["s"] = Math.floor(second)
        return array
    }

    // 计算凌晨时间(秒为单位)
    public static zero(t) {
        return Math.floor((t + 28800) / 86400) * 86400 - 28800;
    }

    //获取当前时间戳
    public static getTimeSecs() {
        return Math.ceil(new Date().getTime() / 1000)
    }
    //获取系统当前时间
    public static getLocalTimeStr(format = "") {
        let timestr = this.m_curDate.toTimeString()
        let arr = []
        arr = timestr.split(" ")
        let newtimestr = ""
        switch (format) {
            case "%H:%M":
                let arr2 = []
                arr2 = arr[0].split(":")
                newtimestr = arr2[0] + ":" + arr2[1]
                break;
            default:
                newtimestr = arr[0]
                break;
        }
        return newtimestr
    }

    //将倒计时时间转换成标准的“H:m:s”格式
    public static converTimeStr(lefttime, format = "%H:%M:%S") {
        let array = {}
        let timeAry = this.converTimerToHour(lefttime)
        array["hour"] = (timeAry["h"] < 10 ? ("0" + timeAry["h"]) : timeAry["h"]) + ':'
        array["min"] = (timeAry["m"] < 10 ? "0" + timeAry["m"] : timeAry["m"]) + ':'
        array["sec"] = (timeAry["s"] < 10 ? "0" + timeAry["s"] : timeAry["s"])
        if (format == "%M:%S") {
            return array["min"] + array["sec"]
        }
        return array["hour"] + array["min"] + array["sec"]
    }
    //通过时间撮计算年月日时分秒
    public static calDateTime(timeStamp) {
        let array = {}
        this.m_tmpDate.setTime(timeStamp * 1000);
        let y = this.m_tmpDate.getFullYear();
        array["year"] = y.toString()
        let m = this.m_tmpDate.getMonth() + 1;
        array["month"] = m < 10 ? ("0" + m.toString()) : m.toString();
        let d = this.m_tmpDate.getDate();
        array["day"] = d < 10 ? ("0" + d.toString()) : d.toString();
        let h = this.m_tmpDate.getHours();
        array["hour"] = h < 10 ? ("0" + h.toString()) : h.toString();
        let minute = this.m_tmpDate.getMinutes();
        let second = this.m_tmpDate.getSeconds();
        array["min"] = minute < 10 ? ("0" + minute.toString()) : minute.toString();
        array["sec"] = second < 10 ? ("0" + second.toString()) : second.toString();
        return array
    };
    //将时间戳转换成指定日期格式字符串
    public static GetDateBySecs(timeStamp, dateformat = "%Y-%m-%d %H:%M:%S") {
        if (this.isString(timeStamp)) {
            return timeStamp
        }
        let array = this.calDateTime(timeStamp)
        let year = array["year"]
        let month = array["month"]
        let day = array["day"]
        let hour = array["hour"]
        let min = array["min"]
        let sec = array["sec"]
        let datestr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
        switch (dateformat) {
            case "%Y-%m-%d %H:%M":
                datestr = year + "-" + month + "-" + day + " " + hour + ":" + min
                break;
            case "%Y-%m-%d":
                datestr = year + "-" + month + "-" + day
                break;
            case "%H:%M":
                datestr = hour + ":" + min
                break;
            case "%m月%d日":
                datestr = month + "月" + day + "日"
                break;
            case "%m/%d":
                datestr = month + "/" + day
                break;
            case "%Y-%m-%d\n%H:%M":
                datestr = year + "-" + month + "-" + day + "\n" + hour + ":" + min
                break;
        }
        return datestr
    }

    //将日期转化成秒数 格式：yyyy-MM-dd HH:mm:ss
    public static GetTimeByDate(datestr) {
        datestr = this.formatDate(datestr)
        let timestamp = Math.floor((new Date(datestr)).getTime() / 1000)
        return timestamp
    }

    //获取当天的前后几天日期和零点时间戳
    public static GetRangeDateAndTime(range, dateformat = "%Y-%m-%d %H:%M:%S") {
        let curtime = this.m_curDate.getTime()
        let resultArr = []
        let timeArr = []
        resultArr.push(this.GetDateBySecs(curtime / 1000, dateformat))
        if (range < 0) {
            for (let i = 1; i < Math.abs(range); i++) {
                let tmptime = (curtime + (-1000 * 3600 * 24 * i)) / 1000 //计算时间戳
                timeArr.push(tmptime + 86400)
                resultArr.push(this.GetDateBySecs(tmptime, dateformat))
            }
        } else {
            for (let i = 1; i <= range; i++) {
                let tmptime = (curtime + (1000 * 3600 * 24 * i)) / 1000
                timeArr.push(tmptime + 86400)
                resultArr.push(this.GetDateBySecs(tmptime, dateformat))
            }
        }
        cc.log("resultArr:" + resultArr)
        cc.log("timeArr:" + timeArr)
        // for (let i = 0; i < timeArr.length; i++) {
        //     cc.log("---date:"+this.GetDateBySecs(timeArr[i])+"\n")
        // }
        return [resultArr, timeArr]
    }

    //将超过1万的数转换成带小数点显示
    public static getRefNum(value) {
        let num = 10000
        let numstr = ""
        if (value >= num) {
            let val1 = value % 10000
            if (val1 >= 1000) {
                numstr = (value / 10000).toFixed(1) + "万"
            } else {
                numstr = Math.floor(value / 10000) + "万"
            }
        } else {
            numstr = value
        }
        return numstr
    }

    //得到一个随机的MacId存在本地
    public static getRandMacId() {
        let time = "mac" + Math.random() + new Date().getTime()
        return MD5.hex_md5(time).toLocaleLowerCase()
    }

    /**
     * 得到一个节点的世界坐标
     * node的原点在中心
    */
    public static localConvertWorldPointAR(node) {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    }

    /**
     * 得到一个节点的世界坐标
     * node的原点在左下边
     */
    public static localConvertWorldPoint(node) {
        if (node) {
            return node.convertToWorldSpace(cc.v2(0, 0));
        }
        return null;
    }
    /**
     * 把一个世界坐标的点，转换到某个节点下的坐标
     * 原点在node中心
    */
    public static worldConvertLocalPointAR(node, worldPoint) {
        if (node) {
            return node.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    }

    /**
     * 把一个世界坐标的点，转换到某个节点下的坐标
     * 原点在node左下角
    */
    public static worldConvertLocalPoint(node, worldPoint) {
        if (node) {
            return node.convertToNodeSpace(worldPoint);
        }
        return null;
    }
    /**
     *  把一个节点的本地坐标转到另一个节点的本地坐标下
    */
    public static convetOtherNodeSpace(node, targetNode) {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint = this.localConvertWorldPoint(node);
        return this.worldConvertLocalPoint(targetNode, worldPoint);
    }

    /**
     *  把一个节点的本地坐标转到另一个节点的本地坐标下
    */
    public static convetOtherNodeSpaceAR(node, targetNode) {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint = this.localConvertWorldPointAR(node);
        return this.worldConvertLocalPointAR(targetNode, worldPoint);
    }

    //获取节点的相对坐标
    public static getNodePostion(sprite, parent) {
        let pos1 = sprite.convertToWorldSpaceAR(cc.v2(0, 0))
        let pos2 = parent.convertToNodeSpaceAR(pos1)
        return pos2
    }

    //文本复制
    public static CopyStr(str) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            sdk.getInstance().callUnkownFuction("setClipboardData", { str: str });
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            //安卓平台
            setTimeout(() => {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Sdk_Event", "CopyText", "(Ljava/lang/String;)V", str)
            }, 100);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            //IOS平台
            jsb.reflection.callStaticMethod("RootViewController", "CopyText", str)
        } else {
            //h5
            let input = str
            const el = document.createElement('textarea')
            el.value = input
            el.setAttribute('readonly', '')
            //el.style.contain = 'strict'
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            el.style.fontSize = '12pt' // Prevent zooming on iOS

            const selection = getSelection();
            let originalRange
            if (selection.rangeCount > 0) {
                originalRange = selection.getRangeAt(0)
            }
            document.body.appendChild(el)
            el.select()
            el.selectionStart = 0
            el.selectionEnd = input.length

            let success = false
            try {
                success = document.execCommand('copy')
            } catch (err) { }

            document.body.removeChild(el)

            if (originalRange) {
                selection.removeAllRanges()
                selection.addRange(originalRange)
            }
        }
    }

    public static setOretion() {
        if (!cc.sys.isNative) {
            cc.view.setResizeCallback(function () {
                if (document.body.scrollWidth > document.body.scrollHeight) {
                    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                } else {
                    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                }
            }.bind(this))
        }
    }

    //计算两点之间距离,返回多少m ,  多少km
    public static getDisByCoord(coord1, coord2) {
        let lat1 = (Math.PI / 180) * coord1.latitude
        let lat2 = (Math.PI / 180) * coord2.latitude
        let lon1 = (Math.PI / 180) * coord1.longitude
        let lon2 = (Math.PI / 180) * coord2.longitude
        let dis = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * 6371.004
        if (dis < 1) {
            return Math.floor(dis * 1000) + "m"
        } else {
            return dis.toFixed(1) + "km"
        }
    }
    public static htmlspecialchars(input) {
        input = input.replace('&', '&amp;')
        for (let k in this._htmlspecialchars_set) {
            let v = this._htmlspecialchars_set[k]
            input = input.replace(v, k)
        }
        return input
    }
    public static nl2br(input) {
        return input.replace("\n", "<br />")
    }

    public static text2html(input) {
        if (typeof (input) == "string") {
            input = input.replace("\t", "    ")
            input = this.htmlspecialchars(input)
            //input = input.replace(" ", "&nbsp;")
            input = this.nl2br(input)
        }
        return input
    }
    

    //浏览器上判断当前设备是ios还是安卓
    public static getWebAndroidOrIOS() {
        var osname = ""
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            osname = "android"
        }
        if (isiOS) {
            osname = "ios"
        }
        return osname
    }

    /**
     * 判断是否是Emoji
     *
     * @param substring 检测的字符串
     * @return
     */
    private static isEmojiCharacter(substring, index) {
        var hs = substring.charCodeAt(index);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                var ls = substring.charCodeAt(index + 1);
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            var ls = substring.charCodeAt(index + 1);
            if (ls == 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                || hs == 0x2b50) {
                return true;
            }
        }
    }


    public static emoji2Str(str) {
        return unescape(escape(str).replace(/\%uD.{3}/g, ''));
    }

    //格式化昵称
    public static formatNick(val, Nicklength = 5) {
        var strNick = decodeURI(val)
        strNick = this.emoji2Str(strNick)
        if (strNick.length > Nicklength) {
            let newnick = ""
            for (let index = 0; index < Nicklength; index++) {
                if (!this.isEmojiCharacter(strNick, index)) {
                    newnick = newnick + strNick[index]
                }
            }
            newnick = newnick + ".."
            return newnick
        } else {
            return strNick
        }
    }

    //格式化id
    public static formatID(val) {
        var strid = String(val)
        if (strid) {
            if (strid.length >= 6) {
                return strid[0] + strid[1] + "***" + strid[5]
            } else {
                return strid[0] + "***" + strid[strid.length]
            }
        } else {
            return 0
        }
    }
}
