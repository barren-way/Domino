import Sdk_Base from "./Sdk_Base";

//所有事件
let event_wechat_login = "event_wechat_login";
let event_wechat_share = "event_wechat_share";
let event_location = "event_location";
let event_notify_pay = "event_notify_pay"

//平台文件类名
let class_name_android = "org/cocos2dx/javascript/Sdk_Wechat"
let class_name_ios = "RootViewController";

export default class Sdk_Wechat extends Sdk_Base {

    private ary_event: object = {};

    //////////////////////////////////////////////////////// base ////////////////////////////////////////////////////////////////

    protected init_sdk(): void {
        if (cc.sys.isNative) {
            cc.director.on(event_wechat_login, this.on_wechat_login.bind(this));
            cc.director.on(event_wechat_share, this.on_wechat_share.bind(this));
            cc.director.on(event_notify_pay, this.on_notify_pay.bind(this));
            cc.director.on(event_location, this.on_location.bind(this));

            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "Sdk_Init");
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    public login(fun_1, fun_2) {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "weixinSign", "()V");
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "Sdk_WechatLogin");
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    public showToast(txt) {
        if (cc.sys.isNative) {
            if (txt) {
                switch (cc.sys.os) {
                    case cc.sys.OS_ANDROID: {
                        jsb.reflection.callStaticMethod(class_name_android, "showToast", "(Ljava/lang/String;)V", txt);
                        break;
                    }
                    case cc.sys.OS_IOS: {
                        jsb.reflection.callStaticMethod(class_name_ios, "Sdk_showToast", txt);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    }

    public getLocation(call_func) {
        if (cc.sys.isNative) {
            this.regist_event("event_location", call_func);
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "GetLatitude", "()V");
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "Sdk_getGpsPosition");
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            this.getPosition().then(result => {
                if (call_func) {
                    call_func(result, 3);
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    private getPosition() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let latitude = position.coords.latitude
                    let longitude = position.coords.longitude
                    let data = {
                        latitude: latitude,
                        longitude: longitude
                    }
                    resolve(data)
                }, function () {
                    reject(arguments)
                })
            } else {
                reject('你的浏览器不支持当前地理位置信息获取')
            }
        })
    }
    //分享文字标题链接到微信好友
    public wxShare(type, title?, desc?, url?, imgpath?) {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    if (type == 9) { //分享文字链接给微信好友
                        jsb.reflection.callStaticMethod(class_name_android, "weixinShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", title, desc, url);
                    } else if (type == 8) { //分享图片给微信好友
                        jsb.reflection.callStaticMethod(class_name_android, "weixinShareImg", "(Ljava/lang/String;)V", imgpath)
                        //this.ShareScreenShot(type);
                    } else if (type == 1) {
                        jsb.reflection.callStaticMethod(class_name_android, "weixinShareText", "(Ljava/lang/String;Ljava/lang/String;I)V", title, desc, 0);
                    } else if (type == 7) { //分享朋友圈
                        jsb.reflection.callStaticMethod(class_name_android, "weixinShareTimeline", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", title, desc, url);
                    } else if (type == 10) {//图片分享至朋友圈
                        jsb.reflection.callStaticMethod(class_name_android, "weixinShareTimeline", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "", "", "", imgpath)
                        //this.ShareScreenShot(type);
                    }
                    break;
                }
                case cc.sys.OS_IOS: {
                    if (type == 9) { //分享文字链接给微信好友
                        jsb.reflection.callStaticMethod(class_name_ios, "Sdk_WechatShareUrl:Share_title:Share_url:", title, desc, url);
                    } else if (type == 8) { //分享图片给微信好友
                        jsb.reflection.callStaticMethod(class_name_ios, "Sdk_WechatShareImg:", imgpath.toString());
                        //this.ShareScreenShot(type);
                    } else if (type == 1) {
                        jsb.reflection.callStaticMethod(class_name_ios, "Sdk_WechatShareUrl:Share_title:Share_url:", title, desc, "");
                    } else if (type == 7) { //分享朋友圈
                        jsb.reflection.callStaticMethod(class_name_ios, "Sdk_WechatShareFriends:Share_title:Share_url:", title, desc, url);
                    } else if (type == 10) { //分享图片给微信朋友圈
                        //this.ShareScreenShot(type);
                        jsb.reflection.callStaticMethod(class_name_ios, "Sdk_WechatShareImgFriends:", imgpath.toString());
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        } else {

        }
    }

    public ShareScreenShot() {
        let node = new cc.Node();
        node.parent = cc.director.getScene();
        node.width = cc.view.getVisibleSize().width;
        node.height = cc.view.getVisibleSize().height;
        node.x = cc.view.getVisibleSize().width / 2;
        node.y = cc.view.getVisibleSize().height / 2;
        console.log("node.width:" + node.width)
        console.log("node.height:" + node.height)

        let camera = node.addComponent(cc.Camera);
        camera.cullingMask = 0xffffffff;
        let texture = new cc.RenderTexture();
        texture.initWithSize(node.width, node.height, cc["gfx"].RB_FMT_D24S8);
        camera.targetTexture = texture;
        camera.render(null);
        let data = texture.readPixels();
        let width = texture.width;
        let height = texture.height;

        let picData = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }

        //data = this.filpYImage(data, width, height)
        let fileName = "result_share.jpg";
        let fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if (jsb.fileUtils.isFileExist(fullPath)) {
            jsb.fileUtils.removeFile(fullPath);
        }
        let success = jsb["saveImageData"](picData, width, height, fullPath);
        if (success) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(class_name_android, "weixinShareImg", "(Ljava/lang/String;)V", fullPath)
            }
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("VXManager", "shareScreenShot:", fullPath.toString());
            }
            camera.destroy();
            texture.destroy();
        }
    }

    //注册事件
    public regist_event(event, call) {
        if (event && call) {
            this.ary_event[event] = call;
        }
    }

    getDunPort(port) {
        var new_port = 0;
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    new_port = jsb.reflection.callStaticMethod(class_name_android, "getDunPort", "(I)I", port);
                    break;
                }
                case cc.sys.OS_IOS: {
                    new_port = jsb.reflection.callStaticMethod(class_name_ios, "Sdk_getDunPort:", port);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return new_port;
    }

    getDunUserIp() {
        var u_ip = null;
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    u_ip = jsb.reflection.callStaticMethod(class_name_android, "getUserIp", "()Ljava/lang/String;");
                    break;
                }
                case cc.sys.OS_IOS: {
                    u_ip = jsb.reflection.callStaticMethod(class_name_ios, "Sdk_getUserIp");
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return u_ip;
    }
    //获取APP的大版本号
    getAppVer() {
        let app_ver = "1.0.0"
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    app_ver = jsb.reflection.callStaticMethod(class_name_android, "getPackageVersion", "()Ljava/lang/String;")
                    break
                }
                case cc.sys.OS_IOS: {
                    app_ver = jsb.reflection.callStaticMethod(class_name_ios, "Sdk_getPackageVersion")
                    break
                }
                default: {
                    break
                }
            }
        }
        return app_ver
    }

    //获取platform
    getPlatForm() {
        let platform = ""
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    platform = "yl_html"
                    break
                }
                case cc.sys.OS_IOS: {
                    platform = "yl_ios_normal"
                    break
                }
                default: {
                    break;
                }
            }
        } else {
            platform = "webgame"
        }

        return platform
    }

    //上传头像
    uploadImg(params) {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Sdk_Event", "openPhoto", "(Ljava/lang/String;Ljava/lang/String;)V", params.url, params.playerid)
                    break
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod("RootViewController", "Sdk_openPhoto:UserId:", params.url, "" + params.playerid)
                    break
                }
                default: {
                    break
                }
            }
        } else {
            if (params.playerid) {
                params["args"] = { ["id:" + params.playerid]: 1 }
            }
            this.uploadWebImg(params)
        }
    }

    private uploadWebImg(exParams) {
        let sendWebimg = (url, params, file, callback?) => {
            let BOUNDARY = "---------7d4a6d158c9"
            let MULTIPART_FORM_DATA = "multipart/form-data"
            let mXhr = cc.loader.getXMLHttpRequest();
            mXhr.open('POST', url);
            mXhr.setRequestHeader("Content-Type", MULTIPART_FORM_DATA + "; boundary=" + BOUNDARY)
            mXhr['onreadystatechange'] = () => {
                if (mXhr.readyState !== 4) {
                    return
                }

                if ((mXhr.status < 200 || mXhr.status > 207)) {
                    if (callback) {
                        callback(1)
                    }
                    return
                }
                var response = mXhr.responseText;
                if (!response || response.length < 1) {
                    if (callback) {
                        callback(1)
                    }
                    return
                }
                var output = typeof (response) == "string" ? JSON.parse(response) : response;
                if (callback) {
                    callback(0, output)
                }
            }

            let sb = new Array()
            for (let name in params) {
                //跳过继承属性
                if (!params.hasOwnProperty(name)) continue;
                if (typeof params[name] === "function") {
                    //跳过方法
                    continue;
                }
                if (params[name] == null || params[name] == undefined) {
                    //跳过null和undefined
                    continue;
                }
                //把值转换成字符串
                let value = params[name].toString();
                //编码名字
                //name = encodeURIComponent(name.replace("%20", "+"));
                //编码值
                value = encodeURIComponent(value.replace("%20", "+"));
                sb.push("--")
                sb.push(BOUNDARY)
                sb.push("\r\n")
                sb.push("Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n");
                sb.push(value)
                sb.push("\r\n")
            }
            sb.push("--")
            sb.push(BOUNDARY)
            sb.push("\r\n")
            sb.push("Content-Disposition: form-data; name=\"imgfile\"; filename=\"" + file.name + "\"\r\n")
            sb.push("Content-Type:application/octet-stream\r\n\r\n")
            sb.push(file.data)
            sb.push("\r\n")
            sb.push("--" + BOUNDARY + "--\r\n")
            mXhr.send(sb.join(""))
        }

        let tmpSelectFile = (evt) => {
            let param = evt.target
            var fileList = param.files[0];
            //////////////////////////////////////////////////////////////////////
            var reader = new FileReader();
            reader.readAsDataURL(fileList);
            let filename = fileList.name
            let self = this
            reader.onload = function (event) {
                let image = new Image() //新建一个img标签（还没嵌入DOM节点)
                var dataImg = event.target.result;
                var num = 0;
                image.src = dataImg
                image.onload = function () {
                    cc.log(fileList.size)
                    //由于不能将太多Base64字符给服务端发过于，咱们压缩一下
                    //如果想支持更大图片，请继续加判断，增加除数
                    if (fileList.size < 250000) {
                        num = 1
                    } else {
                        num = fileList.size / 200000
                    }
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    let imageWidth = image.width / num;  //压缩后图片的大小
                    let imageHeight = image.height / num;
                    canvas.width = imageWidth;
                    canvas.height = imageHeight;
                    context.drawImage(image, 0, 0, imageWidth, imageHeight);
                    let dataImg = canvas.toDataURL('image/jpeg');
                    sendWebimg(exParams.url, exParams.args || {}, { name: filename, data: dataImg }, exParams.callback)
                }
            }
        }
        var fileInput = document.getElementById("fileInput");
        if (fileInput) {
            document.body.removeChild(fileInput)
        }
        fileInput = document.createElement("input");
        fileInput.id = "fileInput";
        fileInput["type"] = "file";
        fileInput["accept"] = "image/*";
        fileInput.style.height = "0px";
        fileInput.style.display = "block";
        fileInput.style.overflow = "hidden";
        document.body.insertBefore(fileInput, document.body.firstChild);
        fileInput.addEventListener('change', tmpSelectFile.bind(this), false);
        setTimeout(function () { fileInput.click() }, 1);
    }

    ////////////////////////////////////////////////////////////////////// event callback //////////////////////////////////////////////////////////////////////

    public on_wechat_login(args) {
        if (!args) {
            return;
        }
        var call_back = this.ary_event[event_wechat_login];
        if (call_back) {
            //不同平台传参格式不一样，需要处理
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    call_back(args.token);
                    break;
                }
                case cc.sys.OS_IOS: {
                    call_back(args);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    public on_wechat_share(args) {
        if (!args) {
            return;
        }
        var call_back = this.ary_event[event_wechat_share];
        if (call_back) {

        }
    }

    public on_notify_pay(args) {
        var call_back = this.ary_event[event_notify_pay];
        if (call_back) {
            call_back(args)
        }
    }


    public on_location(longtitude, latitude) {
        if (!longtitude || !latitude) {
            return;
        }

        let data = {
            latitude: latitude,
            longitude: longtitude
        }

        var call_back = this.ary_event[event_location];
        if (call_back) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    call_back(data, 5);
                    break;
                }
                case cc.sys.OS_IOS: {
                    call_back(data, 1);
                    break;
                }
                default: {
                    call_back(data, 3);
                    break;
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////// ym voice //////////////////////////////////////////////////////////////////////

    public startRecord() {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "ym_startRecordAudio", "()V");
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "ym_startRecordAudio");
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            VoiceUtils.startRecord();
        }
    }

    public finishRecord() {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "ym_stopAndSendAudio", "()V");
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "ym_stopAndSendAudio");
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            VoiceUtils.finishRecord();
        }
    }

    public cancelRecord() {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "ym_cancelRecordAudio", "()V");
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "ym_cancelRecordAudio");
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            VoiceUtils.cancelRecord();
        }
    }

    public saveUserInfo(id, sid) {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "ym_login", "(Ljava/lang/String;Ljava/lang/String;)V", "" + id, sid);
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "ym_login:", "" + id);
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            VoiceUtils.saveUserInfo(id, sid);
        }
    }

    public joinRoom(r_id) {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "ym_joinChatRoom", "(Ljava/lang/String;)V", "" + r_id);
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "ym_joinChatRoom:", "" + r_id);
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            VoiceUtils.joinRoom(r_id);
        }
    }

    public leaveRoom() {
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "ym_leaveChatRoom", "()V");
                    break;
                }
                case cc.sys.OS_IOS: {
                    jsb.reflection.callStaticMethod(class_name_ios, "ym_leaveChatRoom");
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            VoiceUtils.leaveRoom();
        }
    }

    public payWx(payInfo, callback?) {
        this.regist_event(event_notify_pay, callback)
        if (cc.sys.isNative) {
            switch (cc.sys.os) {
                case cc.sys.OS_ANDROID: {
                    jsb.reflection.callStaticMethod(class_name_android, "payWx", "(Ljava/lang/String;)V", JSON.stringify(payInfo));
                    break;
                }
                case cc.sys.OS_IOS: {
                    //jsb.reflection.callStaticMethod(class_name_ios, "ym_leaveChatRoom");
                    break;
                }
                default: {
                    break;
                }
            }
        } else {

        }
    }
}
