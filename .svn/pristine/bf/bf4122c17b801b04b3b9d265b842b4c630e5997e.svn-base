import Sdk_Base from "./Sdk_Base";


export default class Sdk_WechatGame extends Sdk_Base {


	private static mInstance: Sdk_WechatGame = null;
	private mLoginCallback = null;
	private mOtherCallback = null;
	private mShareCallback = null;
	public static getInstance() {
		if (!Sdk_WechatGame.mInstance) {
			Sdk_WechatGame.mInstance = new Sdk_WechatGame();
		}
		return Sdk_WechatGame.mInstance;
	}

	protected init_sdk(): void {
		window["wx"].showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})
	}

	public login(fun_1, fun_2) {

	}

	public showToast(txt) {

	}

	public getLocation(call_func) {

	}

	//注册事件
	public regist_event(event, call) {

	}

	public onShareCallback(fun_call) {
		if (!fun_call) {
			return
		}

		if (!window["wx"]) {
			return
		}

		window["wx"].onShareAppMessage(fun_call);
		window["wx"].onShareTimeline(fun_call);
	}

	public wechatGameLogin(args) {
		if (!window["wx"]) {
			if (args && args.callback) {
				args.callback(1)
			}
			return
		}

		if (args && args.callback) {
			this.mLoginCallback = args.callback
		}

		let self = this
		window["wx"].getSetting({
			success: function (res) {
				if (!res.authSetting['scope.userInfo']) {
					//没有的话,画出按钮
					self.mLoginCallback(2)
				} else {
					//如果有直接获取用户信息
					self.wxUserLogin()
				}
			},
			fail: function () {
				self.mLoginCallback(1)
			}
		})
	}

	public wxUserLogin(userinfo?: any) {
		let self = this
		let launchinfo = window["wx"].getLaunchOptionsSync()
		window["wx"].login({
			success: function (res) {
				let wxcode = res.code
				if (userinfo == null) {
					//如果有直接获取用户信息
					window["wx"].getUserInfo({
						success: function (res) {
							self.mLoginCallback(0, { code: wxcode, user_info: JSON.stringify(res), launchinfo: launchinfo })
						},
						fail: function () {
							self.mLoginCallback(1)
						}
					})
				} else {
					self.mLoginCallback(0, { code: wxcode, user_info: JSON.stringify(userinfo), launchinfo: launchinfo })
				}
			},
			fail: function () {
				self.mLoginCallback(1)
			}
		})
	}

	public createUserInfoButton(args?) {
		if (!window["wx"]) {
			if (args && args.callback) {
				args.callback(1)
			}
			return
		}

		if (args && args.callback) {
			this.mLoginCallback = args.callback
		}

		let self = this
		//获取微信界面大小
		let style
		if (args && args.style) {
			style = args.style
		} else {
			let sysInfo = window["wx"].getSystemInfoSync()
			style = {
				left: 0,
				top: 0,
				width: sysInfo.screenWidth,
				height: sysInfo.screenHeight,
			}
		}

		let button = window["wx"].createUserInfoButton({
			type: 'text',
			text: '',
			style: style,
			withCredentials: true
		})

		button.onTap((res) => {
			if (res.errMsg == "getUserInfo:ok") {
				button.hide()
				self.wxUserLogin(res)
			}
		})
	}

	public setClipboardData(args) {
		if (!window["wx"]) {
			if (args && args.callback) {
				args.callback("fail")
			}
			return
		}
		window["wx"].setClipboardData({
			data: args.str,
			success: (res) => {
				if (args && args.callback) {
					args.callback("ok")
				}
			}
		});
	}

	/*=============================分享相关===============================*/
	private shareParams = function (self, params) {
		params.success = (res) => {
			if (self.mShareCallback) {
				self.mShareCallback("ok")
			}
		}

		params.fail = (res) => {
			if (self.mShareCallback) {
				self.mShareCallback("fail")
			}
		}

		params.complete = (res) => {
			if (self.mShareCallback) {
				self.mShareCallback("complete")
			}
		}
		return params
	}
	//分享文字标题链接到微信好友
	public doshare(args?) {
		if (!window["wx"]) {
			if (args && args.callback) {
				args.callback("fail")
			}
			return
		}

		if (args && args.callback) {
			this.mShareCallback = args.callback
		}

		window["wx"].shareAppMessage(this.shareParams(this, args.params))
	}

	/////////////////////////////////////////////////////////////////////////////虚拟支付////////////////////////////////////////////////////////////////////////////////
	public doPay(params?) {
		if (cc.sys.os == cc.sys.OS_ANDROID) { //android平台
			window["wx"].requestMidasPayment({
				mode: 'game',
				offerId: params.offerId, //在米大师侧申请的应用 id
				buyQuantity: params.buyQuantity,
				zoneId: params.zoneId,
				env: params.env, //0米大师正式环境,1米大师沙箱环境
				currencyType: 'CNY',
				platform: 'android',
				success() { // 支付成功
					console.log("成功了啊++++++++++++++++++++")
					if (params.callback) {
						params.callback({ code: 0 })
					}
				},
				fail({ errMsg, errCode }) { // 支付失败
					console.log("失败了啊++++++++++++++++++++")
					console.log(errMsg, errCode)
					if (params.callback) {
						params.callback({ code: 1 })
					}
				}
			});
		} else {
			if (params.callback) {
				params.callback({ code: 1 })
			}
		}
	}

	/////////////////////////////////////////////////////////////////////////////虚拟支付////////////////////////////////////////////////////////////////////////////////

	public ShareScreenShot() {

	}

	////////////////////////////////////////////////////////////////////// event callback //////////////////////////////////////////////////////////////////////

	public on_wechat_login(args) {

	}

	public on_wechat_share(args) {

	}

	public on_notify_pay(args) {

	}


	public on_location(longtitude, latitude) {

	}

	////////////////////////////////////////////////////////////////////// ym voice //////////////////////////////////////////////////////////////////////

	public startRecord() {

	}

	public finishRecord() {

	}

	public cancelRecord() {

	}

	public saveUserInfo(id, sid) {

	}

	public joinRoom(r_id) {

	}

	public leaveRoom() {

	}
}
