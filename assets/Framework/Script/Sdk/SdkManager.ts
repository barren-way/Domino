import Sdk_Base from "./Sdk_Base";
import Sdk_Wechat from "./Sdk_Wechat";
import Sdk_WechatGame from "./Sdk_WechatGame";

let safeCall = function (obj, name, params?) {
    if (!obj || typeof (name) != 'string') {
        return
    }
    let fuc = obj[name]
    if (Object.prototype.toString.call(fuc) == "[object Function]") {
        return fuc.call(obj, params)
    }
}

export default class SdkManager {

    //单例
    private static mInstance: SdkManager = null;
    private sdk_instance: Sdk_Base = null;

    public static getInstance(): SdkManager {
        if (!SdkManager.mInstance) {
            SdkManager.mInstance = new SdkManager();
            SdkManager.mInstance.init();
        }
        return SdkManager.mInstance;
    }

    public createCurSdk(): Sdk_Base {
        var sdk
        console.log("cc.sys.platform====" + cc.sys.platform)
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            sdk = new Sdk_WechatGame();
        } else {
            sdk = new Sdk_Wechat();
        }

        return sdk;
    }

    public getSdkInstance(): Sdk_Base {
        if (!this.sdk_instance) {
            this.sdk_instance = this.createCurSdk();
        }
        return this.sdk_instance;
    }

    public init(): void {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.init();
        }
    }

    //调用一些未定义的方法
    public callUnkownFuction(name, params?) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            safeCall(sdk, name, params);
        }
    }

    //////////////////////////////////////////////////////// base ////////////////////////////////////////////////////////////////

    public showToast(txt) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.showToast(txt);
        }
    }

    public showLoading(txt) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.showLoading(txt);
        }
    }

    public hideLoading() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.hideLoading();
        }
    }

    public vibrate_short() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.vibrate_short();
        }
    }

    public saveLaunchData() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.saveLaunchData();
        }
    }

    public right_conner_handle(): boolean {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.right_conner_handle();
        }
        return false;
    }

    public is_own_banner(): boolean {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.is_own_banner();
        }
        return false;
    }

    public showRater() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.showRater();
        }
    }

    public regist_event(event, call) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.regist_event(event, call);
        }
    }

    public getLocation(call_func) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.getLocation(call_func);
        }
    }

    public wxShare(type, title?, desc?, url?, imgpath?) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.wxShare(type, title, desc, url, imgpath);
        }
    }

    //微信分享链接到好友
    public payWx(payInfo, callback?) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.payWx(payInfo, callback);
        }
    }

    public doPay(payInfo) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.doPay(payInfo);
        }
    }

    public ShareScreenShot() {
    }

    public getDunPort(port) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.getDunPort(port);
        }
        return 0;
    }

    public getDunUserIp() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.getDunUserIp();
        }
        return null;
    }

    public getAppVer() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.getAppVer();
        }
        return "1.0.0";
    }

    public getPlatForm() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.getPlatForm();
        }
        return "";
    }

    public uploadImg(params) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.uploadImg(params);
        }
    }

    //////////////////////////////////////////////////////// clip video ////////////////////////////////////////////////////////////////

    public clipVideo() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.clipVideo();
        }
    }

    public stopClipVideo() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.stopClipVideo();
        }
    }

    public saveClipVideo() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.saveClipVideo();
        }
    }

    public shareClipVideo(title_str) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.shareClipVideo(title_str);
        }
    }

    public isClipVideoEnabled() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.isClipVideoEnabled();
        }
        return false;
    }

    //////////////////////////////////////////////////////// login ////////////////////////////////////////////////////////////////

    public login(func_1, func_2) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.login(func_1, func_2);
        }
    }

    public login_sdk_button(): boolean {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.login_sdk_button();
        }
        return false;
    }

    public login_info(func_1, func_2) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.login_info(func_1, func_2);
        }
    }

    public login_button_show(func) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.login_button_show(func);
        }
    }

    public login_button_hide() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.login_button_hide();
        }
    }

    public setLoginState(l_state) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.setLoginState(l_state);
        }
    }

    public is_sdk_login() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.is_sdk_login();
        }
        return false
    }

    //////////////////////////////////////////////////////// share ////////////////////////////////////////////////////////////////

    public share_menu_show() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.share_menu_show();
        }
    }

    public share_menu_hide() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.share_menu_hide();
        }
    }

    public share(share_info) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.share(share_info);
        }
    }

    public share_passive(func) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.share_passive(func);
        }
    }

    public is_share_enable(): boolean {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.is_share_enable();
        }
        return false;
    }

    //////////////////////////////////////////////////////// advertisment ////////////////////////////////////////////////////////////////

    public getAd_Banner() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.getAd_Banner();
        }
    }

    public ad_banner_show() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_banner_show();
        }
    }

    public ad_banner_hide() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_banner_hide();
        }
    }

    public ad_banner_midBottom() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_banner_midBottom();
        }
    }

    public ad_banner_bottom() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_banner_bottom();
        }
    }

    public ad_banner_update() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_banner_update();
        }
    }

    public getAd_Video() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.getAd_Video();
        }
    }

    public ad_video_show() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_video_show();
        }
    }

    public ad_insert_show() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_insert_show();
        }
    }

    public ad_load() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.ad_load();
        }
    }

    public setBannerCallback(call_error) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.setBannerCallback(call_error);
        }
    }

    public setVideoCallback(call_end, call_error) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.setVideoCallback(call_end, call_error);
        }
    }

    //////////////////////////////////////////////////////// event ////////////////////////////////////////////////////////////////

    public dischat_event(evt_name, event_data) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.dischat_event(evt_name, event_data);
        }
    }

    public dischat_navigate(event) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.dischat_navigate(event);
        }
    }

    public post_message(msg, data) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.post_message(msg, data);
        }
    }

    public is_navigate_enable(): boolean {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.is_navigate_enable();
        }
        return false;
    }

    public is_friend_enable(): boolean {
        var sdk = this.getSdkInstance();
        if (sdk) {
            return sdk.is_friend_enable();
        }
        return false;
    }

    //////////////////////////////////////////////////////// voice ////////////////////////////////////////////////////////////////

    public startRecord() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.startRecord();
        }
    }

    public finishRecord() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.finishRecord();
        }
    }

    public cancelRecord() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.cancelRecord();
        }
    }

    public saveUserInfo(id, sid) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.saveUserInfo(id, sid);
        }
    }

    public joinRoom(r_id) {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.joinRoom(r_id);
        }
    }

    public leaveRoom() {
        var sdk = this.getSdkInstance();
        if (sdk) {
            sdk.leaveRoom();
        }
    }
}
