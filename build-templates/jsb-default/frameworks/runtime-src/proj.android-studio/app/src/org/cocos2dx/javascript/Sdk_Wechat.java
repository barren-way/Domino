package org.cocos2dx.javascript;
import android.annotation.TargetApi;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.cocos2dx.javascript.service.SDKClass;
import java.io.File;
import java.util.List;

import com.Qsu;
import com.mostone.open.sdk.MAuthApi;
import com.mostone.open.sdk.ShareAction;
import com.mostone.open.sdk.listener.MAuthListener;
import com.mostone.open.sdk.listener.MShareListener;
import com.mostone.open.sdk.media.MImageData;
import com.mostone.open.sdk.media.MWebData;
import com.mostone.open.sdk.model.BeanMAuth;
import com.mostone.open.sdk.model.BeanMResp;
import com.tencent.tmgp.ssqp.wxapi.WXEntryActivity;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.youme.imsdk.YIMClient;
import com.youme.imsdk.YIMConstInfo;
import com.youme.imsdk.YIMMessage;
import com.youme.imsdk.callback.YIMEventCallback;
import com.youme.imsdk.internal.ChatRoom;
import com.youme.imsdk.internal.SendVoiceMsgInfo;
import org.json.JSONObject;
import com.tencent.mm.opensdk.modelpay.PayReq;

public class Sdk_Wechat extends SDKClass {

    private static Context mainActive = null;
    private static String room_no=null;

    private static String mUserId = "123";
    private static String mPassword = "123";
    private static String mToken = "123";
    private static String mChatRoomId = null;
    private static long mRecvAudioMsgId = 0;

    private static String mStoragePath = null;
    private static String mSendAudioPath = null;
    private static String mRecvAudioPath = null;

    private static boolean isPlaying = false;
    private YouMeIMCallback mCallback = null;

	private static MShareListener mShareListener=null;

    @Override
    public void init(Context context) {
        mainActive = context;
        initYouMeIMEngine();
        setStoragePath();

        mShareListener = new MShareListener() {
            @Override
            public void onResult(BeanMResp beanMResp) {
                switch (beanMResp.resCode) {
                    case BeanMResp.ResCode.RES_SEND_OK: {
                        Toast.makeText(mainActive, "????????????", Toast.LENGTH_LONG).show();
                        break;
                    }
                    case BeanMResp.ResCode.RES_SENT_FAILED: {
                        Toast.makeText(mainActive, "????????????", Toast.LENGTH_LONG).show();
                        break;
                    }
                    case BeanMResp.ResCode.RES_USER_CANCEL: {
                        Toast.makeText(mainActive, "??????????????????", Toast.LENGTH_LONG).show();
                        break;
                    }
                }
            }
        };
    }

    // ?????????????????????????????????????????????????????????
    public static int getDunPort(int port){
        int new_port = Config.USE_DUN ? Qsu.CreateSisle(Config.DUN_PORTS.get(port), port) : 0;
        return new_port;
    }

    public static String getUserIp(){
        return Config.USE_DUN ? Qsu.GetUserIP() : null;
    }

    //???????????????????????????????????????
    public static void setLocationOption(boolean tip,int span){
        AppActivity.setLocationOption(tip,span);
    }

    public static void mowang_login(){
        BeanMAuth.Req req = new BeanMAuth.Req();
        //??????????????????
        MAuthApi.get(mainActive).sendAuth(req, new MAuthListener() {
            @Override
            public void onResult(BeanMAuth.Resp resp) {
                switch (resp.resCode) {
                    case BeanMResp.ResCode.RES_SEND_OK: {//????????????
                        final String str_code=resp.authCode;
                        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
                        act.runOnGLThread(new Runnable() {
                            @Override
                            public void run() {
                                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"event_mowang_login\",\""+str_code+"\")");
                            }
                        });

                        break;
                    }
                    case BeanMResp.ResCode.RES_SENT_FAILED: {
                        Toast.makeText(mainActive, "????????????", Toast.LENGTH_LONG).show();
                        break;
                    }
                    case BeanMResp.ResCode.RES_USER_CANCEL: {
                        Toast.makeText(mainActive, "????????????", Toast.LENGTH_LONG).show();
                        break;
                    }
                }
            }
        });
    }

    public static void mowang_share(final String title,final String txt,final String img_path){
        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                MWebData mWebData = new MWebData();
                mWebData.title = title;
                mWebData.content = txt;

                if(img_path.length()>10){
                    mWebData.thumbData = new MImageData(mainActive, new File(img_path));//??????app??????
                }else{
                    mWebData.thumbData = new MImageData(mainActive, "");//??????app??????
                }
                mWebData.androidJumpParam = "";//android??????????????????????????????
                mWebData.iOSJumpParam = "";//ios??????????????????????????????
                mWebData.webType = MWebData.WebType.APP;

                new ShareAction((AppActivity)mainActive).withMedia(mWebData).setCallBack(mShareListener).share();
            }
        });
    }

    public static void payWxMini(final String token,final String appid,final String ghid){
        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                IWXAPI api= WXAPIFactory.createWXAPI(act,appid,false);
                WXLaunchMiniProgram.Req wx_req = new WXLaunchMiniProgram.Req();
                wx_req.userName=ghid;
                wx_req.path="pages/payment/result?tokenid="+token;
                wx_req.miniprogramType = WXLaunchMiniProgram.Req.MINIPTOGRAM_TYPE_RELEASE;
                api.sendReq(wx_req);
            }
        });
    }


     public static void payWx(final String payInfo){
        Log.d("????????????===",payInfo);
         final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
         act.runOnUiThread(new Runnable() {
             @Override
             public void run(){
                 try{
                     JSONObject json = new JSONObject(payInfo);
                     PayReq req = new PayReq();
                     req.appId			= json.getString("appid");
                     req.partnerId		= json.getString("partnerid");
                     req.prepayId		= json.getString("prepayid");
                     req.nonceStr		= json.getString("noncestr");
                     req.timeStamp		= json.getString("timestamp");
                     req.packageValue	= json.getString("package");
                     req.sign			= json.getString("paySign");
                     // ?????????????????????????????????????????????????????????????????????IWXMsg.registerApp????????????????????????
                     IWXAPI api= WXAPIFactory.createWXAPI(act, req.appId,false);
                     api.sendReq(req);
                 }catch(Exception e){
                     Log.e("PAY_GET", "?????????"+e.getMessage());
                 }
             }
         });
    }


    ///////////////////////////////////////////////////////////////////////// ym voice ////////////////////////////////////////////////////////////////////////////////

    private void initYouMeIMEngine() {
        mCallback = new YouMeIMCallback();
        YIMClient.getInstance().registerReconnectCallback(mCallback);
        YIMClient.getInstance().registerKickOffCallback(mCallback);
        YIMClient.getInstance().registerMsgEventCallback(mCallback);
    }

    public static void ym_login(String u_id , String u_token) {
        mUserId="uid_"+u_id;
        mPassword="pwd_"+u_id;
        mToken=u_token;

        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
            act.runOnUiThread(new Runnable() {
                @Override
                public void run(){
                    YIMClient.getInstance().login(mUserId, mPassword, "", new YIMEventCallback.ResultCallback<String>() {
                        @Override
                        public void onSuccess(String userId) {
                            Log.d("login ok: ", userId);
                        }

                        @Override
                        public void onFailed(int errorCode, String userId) {
                            Log.d("login err: ", ""+errorCode);
                        }
                    });
                }
             });
    }

    public static void ym_logout() {
        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                YIMClient.getInstance().logout(new YIMEventCallback.OperationCallback() {
                    @Override
                    public void onSuccess() {

                    }

                    @Override
                    public void onFailed(int i) {

                    }
                });
            }
        });
    }

    public static void ym_joinChatRoom(String r_id) {
        mChatRoomId=r_id;

        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                YIMClient.getInstance().joinChatRoom(mChatRoomId, new YIMEventCallback.ResultCallback<ChatRoom>() {
                    @Override
                    public void onSuccess(ChatRoom chatRoom) {
                        Log.d("joinChatRoom: ", ""+chatRoom);
                    }

                    @Override
                    public void onFailed(int errorCode, ChatRoom chatRoom) {
                        Log.d("joinRoom err: ", ""+errorCode);
                    }
                });
            }
        });
    }

    public static void ym_leaveChatRoom() {
        if(mChatRoomId==null){
            return;
        }

        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                YIMClient.getInstance().leaveChatRoom(mChatRoomId, new YIMEventCallback.ResultCallback<ChatRoom>() {
                    @Override
                    public void onSuccess(ChatRoom chatRoom) {
                        mChatRoomId=null;
                    }

                    @Override
                    public void onFailed(int errorCode, ChatRoom chatRoom) {
                        mChatRoomId=null;
                    }
                });
            }
        });
    }

    public static void ym_startRecordAudio() {
        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                YIMClient.getInstance().startRecordAudioMessage(mChatRoomId, YIMConstInfo.ChatType.RoomChat, "attach message", false, false);
            }
        });
    }

    public static void ym_stopAndSendAudio() {
        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                YIMClient.getInstance().stopAndSendAudioMessage(new YIMEventCallback.AudioMsgEventCallback() {
                    @Override
                    public void onStartSendAudioMessage(long requestID, int errorcode, String strText, String strAudioPath, int audioTime) {
                        mSendAudioPath = strAudioPath;
                        playAudio();
                    }

                    @Override
                    public void onSendAudioMessageStatus(int errorcode, SendVoiceMsgInfo voiceMsgInfo) {
                        //??????????????????
                        long r_id=voiceMsgInfo.getRequestId();
                        if(errorcode == 0){
                            Log.d("onSendAudio: ", ""+r_id);
                        }
                    }
                });
            }
        });
    }

    public static void ym_cancelRecordAudio() {
        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                YIMClient.getInstance().cancleAudioMessage();
            }
        });
    }


    public static void downloadAudioMessage() {
        if(mRecvAudioMsgId==0){
            return;
        }
        YIMClient.getInstance().downloadAudioMessage(mRecvAudioMsgId, getAudioPath(), new YIMEventCallback.DownloadFileCallback() {
            @Override
            public void onDownload(int errorCode, YIMMessage yimMessage, String savedPath) {
            if (errorCode == YIMConstInfo.Errorcode.Success) {
                mRecvAudioPath = savedPath;
                mRecvAudioMsgId=0;
                playAudio();
            } else {
                showToast("??????????????????");
                mRecvAudioPath = null;
                mRecvAudioMsgId=0;
            }
            }
        });
    }

    public static void playAudio() {
        if(isPlaying)return;

        //????????????????????????????????????????????????
        String audio_path=null;
        if(mSendAudioPath!=null){
            audio_path=mSendAudioPath;
            mSendAudioPath=null;
        }else{
            if(mRecvAudioPath!=null){
                audio_path=mRecvAudioPath;
                mRecvAudioPath=null;
            }
        }

        if(audio_path==null){
            return;
        }

        isPlaying = true;
        YIMClient.getInstance().startPlayAudio(audio_path, new YIMEventCallback.ResultCallback<String>() {
            @Override
            public void onSuccess(String audioPath) {
                isPlaying = false;
                playAudio();
            }

            @Override
            public void onFailed(int errorcode, String audioPath) {
                isPlaying = false;
            }
        });

    }

    private void setStoragePath() {
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            mStoragePath = Environment.getExternalStorageDirectory().getAbsolutePath();
        }
    }

    private static String getAudioPath() {
        String audioPath = mStoragePath + "/";
        audioPath += mRecvAudioMsgId + ".wav";
        return audioPath;
    }

    ///////////////////////////////////////////////////////////////////////// base /////////////////////////////////////////////////////////////////////////////////

    public static void showToast(String msg){
        final String show_str=msg;

        final Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run(){
                Toast.makeText(mainActive, show_str, Toast.LENGTH_SHORT).show();
            }
        });
    }

    public static void getRoomNo() {
        final String  version = room_no+"";

        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"google_event_end\","+version+")");
            }
        });
    }

    public static void GetDeviceNetLevel() {
        //int[] netInfo=((AppActivity)mainActive).getNetSingnal().getNetInfo();
        //final String  version = (netInfo[0]+","+netInfo[1]);
        final String version = "80,80";

        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"google_event_end\","+version+")");
            }
        });
    }

    public static void GetLatitude() {
        final double cur_lon=AppActivity.longtitude;
        final double cur_lat=AppActivity.latitude;
        final long cur_time=AppActivity.last_gps_time;

        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"event_location\","+cur_lon+","+cur_lat+","+cur_time+")");
            }
        });
    }

    public static void GetDeviceBatteryLevel() {
        //int[] batteryInfo=((AppActivity)mainActive).getBattery().getBatteryInfo();
        //final String  version = (batteryInfo[0]+","+batteryInfo[1]);

        final String version = "1,1";

        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"google_event_end\","+version+")");
            }
        });
    }

    //getVer
    //getPackageVersion
    public static String getPackageVersion() {
        String version = "1.0.0";
        try {
              version = mainActive.getPackageManager().getPackageInfo(mainActive.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
              e.printStackTrace();
        }
        return version;
    }

    public static void getPhoneModel() {
        final String  version = android.os.Build.MODEL + "_" + android.os.Build.VERSION.RELEASE;

        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"google_event_end\","+version+")");
            }
        });
    }

    public static void openBrowser(String key) {
        Uri uri = Uri.parse(key);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        mainActive.startActivity(intent);
    }

    public static void weixinShareImg(String imgurl) {
        //String imgurl = ScreenShotUtils.shotBitmap((Activity)mainActive, System.currentTimeMillis()/1000 + "");
        callWeixinFuc(8, "","","",imgurl);
    }

    // TODO ?????????????????? ?????????????????????????????????
    public static void weixinSign() {
        callWeixinFuc(1);
    }

    // ??????????????????
    public static void weixinCB(final String result) {
        Log.e("weixinCB",result);
        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"event_wechat_share\","+result+")");
            }
        });
    }

    // ??????????????????
    public static void weixinCB_Login(final String result) {
        Log.e("weixinCB_Login",result);
        Cocos2dxActivity act=(Cocos2dxActivity)mainActive;
        act.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"event_wechat_login\","+result+")");
            }
        });
    }

    public static Intent getInitIntent() {
        Intent i = new Intent(Intent.ACTION_SEND);
        i.setType("image/jpeg");
        return i;
    }

    // ????????????
    public static void weixinShare(String title, String desc, String url) {
        callWeixinFuc(9, title,desc,url);
    }

    //?????????????????????
    public static void weixinShareTimeline(String title, String desc, String url ) {
        callWeixinFuc(7, title,desc,url);
    }

    //???????????????????????????
    public static void weixinShareTimeline(String title, String desc, String url,String img_path) {
        callWeixinFuc(10, title,desc,url, img_path);
    }

    public static void weixinShare(String title, String desc, String url,String img_path) {
        callWeixinFuc(8, title,desc,url, img_path);
    }

    public static void weixinShareText(String title, String desc, int luafunc) {
        Intent i = getTextIntent("com.tencent.mm", title, title, desc);
        if (i != null) {
            mainActive.startActivity(i);
        }else{
            Toast.makeText(mainActive, "?????????????????????", Toast.LENGTH_SHORT).show();
        }
    }

    public static void callWeixinFuc(int flag,String ... ps) {
        WXEntryActivity.signflag = flag;
        Intent i = new Intent(mainActive, WXEntryActivity.class);
        i.putExtra("signFlag", "" + flag);

        if(ps.length==3){
            i.putExtra("title", ps[0]);
            i.putExtra("desc", ps[1]);
            i.putExtra("url", ps[2]);
        }else if(ps.length==4){
            Log.d("_____imgurl", "" + ps[3]);
            i.putExtra("title", ps[0]);
            i.putExtra("desc", ps[1]);
            i.putExtra("url", ps[2]);
            i.putExtra("imgurl", ps[3]);
        }
        mainActive.startActivity(i);
    }

    @TargetApi(Build.VERSION_CODES.DONUT)
    public static Intent getTextIntent(String goalPackage, String title, String subject, String content){
        boolean result = false;
        Intent i = new Intent(Intent.ACTION_SEND);
        i.setType("text/plain");
        i.putExtra(Intent.EXTRA_TITLE, title);
        i.putExtra(Intent.EXTRA_SUBJECT, subject);
        i.putExtra(Intent.EXTRA_TEXT, content);

        ComponentName comp;
        //com.tencent.mm.ui.tools.ShareToTimeLineUI
        if(title.equals("1") || true)
            comp = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareImgUI");
        else
            comp = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareToTimeLineUI");

        i.setComponent(comp);

        List<ResolveInfo> resInfo = mainActive.getPackageManager().queryIntentActivities(i, 0);
        if (!resInfo.isEmpty()) {
            for (ResolveInfo info : resInfo) {
                if (info.activityInfo.packageName.equals(goalPackage)) {
                    i.setPackage(goalPackage);
                    result = true;
                }
            }
        }
        if (result)
            return i;
        return null;
    }

    /////////////////////////////////////////////////////////////// base ///////////////////////////////////////////////////////////////////

    // ??????????????????
    private class YouMeIMCallback implements YIMEventCallback.ReconnectCallback, YIMEventCallback.MessageEventCallback, YIMEventCallback.KickOffCallback {

        /**
         * ??????????????????????????????
         *
         * @param message ?????????????????????
         */
        public void onRecvMessage(YIMMessage message) {
            if (null == message)
                return;
            int msgType = message.getMessageType();

            if (YIMConstInfo.MessageBodyType.TXT == msgType) {
                //??????????????????????????????
            } else if (YIMConstInfo.MessageBodyType.Voice == msgType) {
                if(mRecvAudioMsgId==0){
                    mRecvAudioMsgId = message.getMessageID();//??????????????????id
                    downloadAudioMessage();
                }
            }
        }

        /**
         * ???????????????????????????
         *
         * @param errorcode ?????????
         * @param requestID ??????ID
         * @param text      ???????????????????????????
         */
        @Override
        public void onGetRecognizeSpeechText(int errorcode, long requestID, String text) {

        }

        /*
         * ?????????????????????????????????, ??????:1s ???8???
         * @param volume????????????(0???1)
         */
        @Override
        public void onRecordVolume(float volume) {

        }

        /**
         * ??????????????????
         */
        @Override
        public void onStartReconnect() {

        }

        /**
         * ??????????????????
         *
         * @param result 0-???????????????1-??????????????????????????????2-????????????
         */
        @Override
        public void onRecvReconnectResult(int result) {

        }

        /**
         * ??????????????????
         */
        @Override
        public void onKickOff() {

        }

        /**
         * ??????????????????????????????????????????????????????????????????setReceiveMessageSwitch???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????ID
         *
         * @param chatType???????????????
         * @param targetID?????????ID
         */
        @Override
        public void onRecvNewMessage(int chatType, String targetID) {

        }
    }

}
