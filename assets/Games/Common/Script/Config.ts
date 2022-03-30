export module cfg {
    //服务器参数（true正式服，false测试服
    export const isFormal: boolean = false;
    //锁定id
    export const isLock: boolean = true;
    export const isWx: boolean = false;
    export const Version: string = "1.0.0";  //新版热更机制修改后，这个版本号只对H5有用

    export const userServer: string = "/user/sign/guest.json";
    export const userSeverWx: string = "/user/sign/verifyopenid.json"
    export const userWxInfo: string = "/user/sign/url2wxinfo.json?url=xxx"
    export const logSever: string = "/update/clienterrlog.json"

    //微信获取code地址
    export const wxUrl: string = "https://ss.quanziyou.com/test.php"

    //绑定手机，发送验证码
    export const signupSever: string = "/user/signup.json"
    export const smsServer: string = "/user/sms/get.json"
    export const bindServer: string = "/user/sign/bindphone.json"
    export const uServer: string = "/user/signin.json"
    export const modifySever: string = "/user/sign/modifypass.json"
    export const newModifyServer: string = "/user/sign/newpass.json" //带验证码的修改密码
    export const chargeServer: string = "/p/pay/infos" //拉取充值列表
    export const czlServer: string = "/user/pay/record" //拉取充值列表

    //头像上传地址
    export const uploadImgUrl: string = "/gm/savefile/avatar"


    //网页战绩分享链接地址
    export const linkUrl: string = "/?playerid="

    //游密地址
    export const yimUrl: string = ""

    //APK下载地址
    export const apkUrl: string = ""

    //////////////////////////////////////////////////////////////小游戏支付参数////////////////////////////////////////////////////////////////
    export const env: number = 0    //小游戏支付环境（0正式 1沙箱测试）
    export const offerId: number = 1450026280   //小游戏支付环境（0正式 1沙箱测试）
    export const payrate: number = 100  //小游戏支付单价
    export const zoneId: number = 1  //小游戏支付单价

}