//sdk基础类，根据个渠道需求可以扩充

export default class Sdk_Base {

    private sdk_login_state = false;
    private is_init = false;

    public init(): void {
        if (!this.is_init) {
            this.init_sdk();
            this.is_init = true;
        }
    }

    //////////////////////////////////////////////////////// base ////////////////////////////////////////////////////////////////

    //初始化
    protected init_sdk(): void {

    }

    //文字提示
    public showToast(txt) {

    }

    //显示loading转中，一般只是在用户登陆sdk时调用，不屏蔽操作，需要手动关闭
    public showLoading(txt) {

    }

    //隐藏loading
    public hideLoading() {

    }

    //短时间震动
    public vibrate_short() {

    }

    //保存启动游戏的参数（外部传进来的）
    public saveLaunchData() {

    }

    //右上角是否有操作栏
    public right_conner_handle(): boolean {
        return false;
    }

    //是否有自己的推广banner
    public is_own_banner(): boolean {
        return false;
    }

    public showRater() {

    }

    //注册事件
    public regist_event(event, call) {

    }

    //获取经纬度
    public getLocation(call_func) {

    }

    //微信分享链接到好友
    public wxShare(type, title?, desc?, url?, imgpath?) {

    }

    //微信分享链接到好友
    public payWx(payInfo, callback?) {

    }

    public doPay(payInfo) {
    }

    public ShareScreenShot() {
    }




    public getDunPort(port) {
        return 0;
    }

    public getDunUserIp() {
        return null;
    }

    //获取APP大版本号
    public getAppVer() {
        return "1.0.0";
    }

    //获取platform
    public getPlatForm() {
        return ""
    }

    //上传头像
    public uploadImg(params) {

    }
    //////////////////////////////////////////////////////// clip video ////////////////////////////////////////////////////////////////

    //录屏
    public clipVideo() {

    }

    //停止录屏
    public stopClipVideo() {

    }

    //保存录屏
    public saveClipVideo() {

    }

    //分享录屏
    public shareClipVideo(title_str) {

    }

    //是否可以录屏
    public isClipVideoEnabled() {
        return false;
    }

    //////////////////////////////////////////////////////// login ////////////////////////////////////////////////////////////////

    //登陆（成功回调，失败回调）
    public login(func_1, func_2) {

    }

    //渠道是否有自己的登陆按钮
    public login_sdk_button(): boolean {
        return false;
    }

    //获取用户信息（昵称，头像）
    public login_info(func_1, func_2) {

    }

    //显示sdk的登陆按钮
    public login_button_show(func) {

    }

    //隐藏sdk登录按钮
    public login_button_hide() {

    }

    //登陆状态
    public setLoginState(l_state) {
        this.sdk_login_state = l_state;
    }

    //sdk账号是否已登录
    public is_sdk_login() {
        return this.sdk_login_state;
    }

    //////////////////////////////////////////////////////// share ////////////////////////////////////////////////////////////////

    //在（右上角）操作栏里显示分享按钮
    public share_menu_show() {

    }

    //在（右上角）操作栏里显示分享按钮
    public share_menu_hide() {

    }

    //主动分享
    public share(info) {

    }

    //点渠道小程序操作栏里的分享按钮触发的被动分享
    public share_passive(func) {

    }

    //主动分享功能是否可用
    public is_share_enable(): boolean {
        return false;
    }

    //////////////////////////////////////////////////////// advertisment ////////////////////////////////////////////////////////////////

    //广告banner初始化
    public getAd_Banner() {
        return null;
    }

    //显示广告banner
    public ad_banner_show() {

    }

    //隐藏广告banner
    public ad_banner_hide() {

    }

    //显示广告banner在下半屏中间
    public ad_banner_midBottom() {

    }

    //显示广告banner在底部
    public ad_banner_bottom() {

    }

    //更新广告位置
    public ad_banner_update() {

    }

    //视频广告初始化
    public getAd_Video() {
        return null;
    }

    //显示视频广告
    public ad_video_show() {

    }

    //insert广告
    public ad_insert_show() {

    }

    public ad_load() {

    }

    //banner广告error回调
    public setBannerCallback(call_error) {

    }

    //视频广告回调（关闭，出错）
    public setVideoCallback(call_end, call_error) {

    }

    //////////////////////////////////////////////////////// event ////////////////////////////////////////////////////////////////

    //触发统计事件
    public dischat_event(evt_name, event_data) {

    }

    //小程序跳转
    public dischat_navigate(event) {

    }

    //向开放域发送数据
    public post_message(msg, data) {

    }

    //sdk是否自带好友排行
    public is_friend_enable(): boolean {
        return false;
    }

    //sdk是否有跳转功能
    public is_navigate_enable(): boolean {
        return false;
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
