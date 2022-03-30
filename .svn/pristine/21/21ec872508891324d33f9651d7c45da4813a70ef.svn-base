// 微信会用到的一些方法

window.wxData = {};
window.wxData.titleStr = '尚尚游戏';
window.wxData.descStr = '大品牌，无外挂，最专业的约局神器';
window.wxData.shareUrl = getCurUrl() + "?no="; // 分享链接源地址
window.wxData.url = getCurUrl(); // 分享链接
window.wxData.iconPath = getCurUrl(1) + "/icon.png";
window.wxData.shareButtonId = 0; //免费钻石id

const SHARE_FAIL = 0
const SHARE_SUCCESS = 1
const SHARE_CANCEL = 2

//获取当前游戏链接地址
function getCurUrl(type) {
    var url = window.location.href
    let fucurl = decodeURIComponent(url);
    let urllist = fucurl.split("?");
    if (type == 1) {
        let pos = urllist[0].lastIndexOf('/')
        return urllist[0].substring(0, pos)
    }
    return urllist[0]
}

//当前网页打开的浏览器是不是微信浏览器
function isWxBrowser() {
    var ua = window.navigator.userAgent.toLowerCase();
    var match = ua.match(/MicroMessenger/i);
    let yes = match && match.includes('micromessenger')
    console.log("isWxBrowser : " + yes)
    return yes;
}


//微信语音消息
var START, END, recordTimer;
var voice = {
    localId: []
}
var downloadrec = null;
var wxtestrecord = false;


window.WXSdk = {
    type: -1,

    initWxSDK: function (data) {
        console.log("initWxSDK data:" + JSON.stringify(data))
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'getLocation', 'openLocation',
                'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice',
                'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseWXPay',
            ]
        });
        wx.ready(function () {

            wx.checkJsApi({
                jsApiList: [
                    'onMenuShareTimeline', 'showMenuItems', 'onMenuShareAppMessage', 'getLocation', 'openLocation',
                    'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice',
                    'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseWXPay',
                ],
                success: function (res) {
                    cc.log(res);
                }
            });

            //alert("init ready");
            document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
                // 通过下面这个API隐藏底部导航栏
                WeixinJSBridge.call('hideToolbar');
            });

            wx.hideAllNonBaseMenuItem();

            wx.showMenuItems({
                menuList: [
                    'menuItem:share:appMessage',
                    'menuItem:share:timeline',
                    "menuItem:profile",
                    "menuItem:addContact"
                ]
            });

            wx.getLocation({
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90  
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。  
                    var speed = res.speed; // 速度，以米/每秒计  
                    var accuracy = res.accuracy; // 位置精度 
                    var data = {
                        latitude: latitude,
                        longitude: longitude
                    };
                    window.wxData.latitude = parseFloat(res.latitude);
                    window.wxData.longitude = parseFloat(res.longitude);

                    console.log("getLocation=====" + JSON.stringify(data));
                    console.log("latitude=====" + window.wxData.latitude);
                    console.log("longitude=====" + window.wxData.longitude);
                },
                cancel: function () {
                    //这个地方是用户拒绝获取地理位置  
                    // if (typeof error == "function") {
                    //     error();
                    // }
                }
            });
        });
        wx.error(function (res) {
            //alert("init err");
            console.log(res);
        });
    },

    // _title分享标题,_desc分享描述,_link分享链接,_imgUrl分享图标,_type 分享类型,music、video或link，不填默认为link,_dataUr如果type是music或video，则要提供数据链接，默认为空
    shareCall: function (params) {
        var _title = params.title
        //var _desc = params.desc
        //var _link = params.link || window.wxData.url
        var _desc = ""
        var _link = ""
        var _imgUrl = window.wxData.iconPath
        var _type = params.type
        var _dataUrl = params.dataUrl
        var _roomid = params.roomid
        var _callback = params.callback
        if (_roomid) {
            _link = _link + "?roomid=" + _roomid
        }
        console.log("shareCall _link:" + _link)
        wx.ready(function () {
            wx.hideAllNonBaseMenuItem();
            wx.showMenuItems({
                menuList: [
                    'menuItem:share:appMessage',
                    'menuItem:share:timeline',
                    "menuItem:profile",
                    "menuItem:addContact"
                ]
            });
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: _title ? _title : window.wxData.titleStr, // 分享标题
                //link: _link ? _link : "", // 分享链接
                //title: "", // 分享标题
                link: "", // 分享链接
                imgUrl: _imgUrl ? _imgUrl : "", // 分享图标
                success: function () {
                    console.log("分享到朋友圈");
                    if (_callback) {
                        _callback(SHARE_SUCCESS)
                    }

                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    if (_callback) {
                        _callback(SHARE_CANCEL)
                    }
                    console.log("取消");
                },

                fail: function (res) {
                    if (_callback) {
                        _callback(SHARE_FAIL)
                    }
                    console.log(res);
                }

            });
            // 分享给朋友
            wx.onMenuShareAppMessage({
                title: _title ? _title : window.wxData.titleStr, // 分享标题
                //desc: _desc ? _desc : window.wxData.descStr, // 分享描述
                // link: _link ? _link : "", // 分享链接
                //desc: "", // 分享描述
                link: "", // 分享链接
                imgUrl: _imgUrl ? _imgUrl : "", // 分享图标
                type: _type ? _type : '', // 分享类型,music、video或link，不填默认为link
                dataUrl: _dataUrl ? _dataUrl : '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    console.log("分享给朋友");
                    if (_callback) {
                        _callback(SHARE_SUCCESS)
                    }

                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // createTipPao("分享取消");
                    console.log("取消");
                    if (_callback) {
                        _callback(SHARE_CANCEL)
                    }
                },
                fail: function (res) {
                    if (_callback) {
                        _callback(SHARE_FAIL)
                    }
                    console.log(res);
                }

            });
        });
        wx.error(function (res) {
            // alert("init err");
            console.log(res);
        });
    },

    //分享(标题，信息,房号所有数据内容全从客户端传，这个脚本不处理任何算法及修改)
    wxShareFrends: function (params) {
        console.log("wxShareFrends params:" + JSON.stringify(params))
        if (!params.isWx || !isWxBrowser()) return;
        //湖区房间号判断是否为空
        this.shareCall(params)
    },

    wxPay: function (args) {
        wx.ready(() => {
            let payinfo = args.payInfo
            wx.chooseWXPay({
                timestamp: payinfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: payinfo.nonceStr, // 支付签名随机串，不长于 32 位
                package: payinfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: payinfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: payinfo.paySign, // 支付签名
                success: (res) => {
                    // 支付成功后的回调函数
                    if (args && args.callback) {
                        args.callback("ok", res)
                    }
                },
                fail: (res) => {
                    // 支付成功后的回调函数
                    if (args && args.callback) {
                        args.callback("fail", res)
                    }
                }
            });
        })
        wx.error(function (res) {
            console.log(res);
        });
    },

    wxStartRecord: function () {

        wx.ready(function () {
            //记录按下时间，时间过短则不使用录音功能
            START = new Date().getTime();
            //这里是0.3秒
            recordTimer = setTimeout(function () {
                wx.startRecord({
                    success: function () {
                        //localStorage.rainAllowRecord = 'true';
                    },
                    cancel: function () {
                        console.log('用户拒绝授权录音');
                    }
                });
            }, 300);

            var self = this;
            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function (res) {

                    console.log('录音时间超过一分钟没有停止的时候会执行');

                    //window.WXSdk.playVoice(res.localId);
                    //录音结束上传录音
                    window.WXSdk.uploadVoice(res.localId);
                }
            });

        });

    },

    wxEndRecord: function () {

        wx.ready(function () {
            END = new Date().getTime();
            console.log("结束录音");
            if ((END - START) < 300) {
                END = 0;
                START = 0;
                // 小于300ms，不录音
                console.log("小于300ms，不录音");
                clearTimeout(recordTimer);
            }
            else {
                console.log("大于300ms，录音");
                var self = this;
                wx.stopRecord({
                    success: function (res) {
                        console.log(JSON.stringify(res));
                        voice.localId = res.localId;
                        //window.WXSdk.playVoice(res.localId);
                        //录音结束上传录音
                        window.WXSdk.uploadVoice(res.localId);
                    },
                    fail: function (res) {
                        console.log(JSON.stringify(res));
                    }
                });
            }
        });

    },

    // 上传录音
    uploadVoice: function (reslocalId) {
        // 调用微信的上传录音接口把本地录音先上传到微信的服务器
        // 不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.ready(function () {
            wx.uploadVoice({
                localId: voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {

                    var serverId = res.serverId; // 返回音频的服务器端ID
                    downloadrec = res.serverId;
                    console.log(JSON.stringify(res));

                }
            });
        });
    },

    downloadVoice: function (serverId) {

        if (serverId == undefined) {
            serverId = downloadrec;
        }

        wx.ready(function () {
            wx.downloadVoice({
                serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var localId = res.localId; // 返回音频的本地ID
                    window.WXSdk.playVoice(localId);
                }
            });
        });

    },

    playVoice: function (reslocalId) {

        wx.ready(function () {

            wx.playVoice({
                localId: reslocalId // 需要播放的音频的本地ID，由stopRecord接口获得
            });

            wx.onVoicePlayEnd({
                success: function (res) {
                    var localId = res.localId; // 返回音频的本地ID

                    console.log(JSON.stringify(res));
                }
            });
        });

    }




};

cc.view.setResizeCallback(function () {
    if (window.GlobalEvent != null || window.GlobalEvent != undefined) {
        window.GlobalEvent.emit("changeOrientation");
    }
});
