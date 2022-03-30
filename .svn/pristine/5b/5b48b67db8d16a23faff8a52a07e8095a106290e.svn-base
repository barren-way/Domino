package com.tencent.tmgp.ssqp.wxapi;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.cocos2dx.javascript.Config;
import org.cocos2dx.javascript.Sdk_Wechat;
import org.cocos2dx.javascript.util.Util;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendAuth.Resp;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.tencent.tmgp.ssqp.R;

/**
 */
/*
 * 微信登录，分享应用中必须有这个名字叫WXEntryActivity，并且必须在wxapi包名下，腾讯官方文档中有要求
 */
public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
	private static final String TAG = "WXEntryActivity";
	
	// TODO 这里修改成自己的ID SECRET
	private static final String WEIXIN_SCOPE = "snsapi_userinfo";// 用于请求用户信息的作用域
	private static final String WEIXIN_STATE = "login_state"; // 自定义
	public static int signflag = 1;
	
	public static IWXAPI api;
	private SendAuth.Req req;
	
	// TODO 微信登录
	public void weixinSign(){
		Toast.makeText(getApplicationContext(), "登录微信",
				Toast.LENGTH_LONG).show();
		Log.e(TAG, "登录微信");
		sendAuth();
	}
	
	// 微信分享
	public void weixinShare(){
		Log.e(TAG, "分享到朋友圈");
		String text = "微信分享纯文本"; // 用于分享的文字
		String url = "http://blog.csdn.net/xiong_it";// 用于分享的链接
		String picPath = Environment.getExternalStorageDirectory().getAbsolutePath() +"/"+"test.jpg";// 用于分享的本地图片
		final String imgUrl = "http://segmentfault.com/img/bVkIvr";// 用于分享的在线图片
		String musicUrl = "http://staff2.ustc.edu.cn/~wdw/softdown/index.asp/0042515_05.ANDY.mp3";// 用于分享在线音乐
		String videoUrl = "http://v.youku.com/v_show/id_XMjExOTcxNg==.html?f=1245977";// 用于分享的在线视频
		
		// 分享文字：分享成功
		shareText2Circle(text,1);
	}

	// 微信分享
	public void weixinShareFriend(){
		Log.e(TAG, "分享给好友");
		String text = "微信分享纯文本"; // 用于分享的文字
		String url = "http://blog.csdn.net/xiong_it";// 用于分享的链接
		shareText2Circle(text,2);
	}
	
	// 跳到activity里之后 初始wxapi实例 然后自动调动weixinsign
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		api = WXAPIFactory.createWXAPI(this, Config.WX_APPID, false);

		if(!api.isWXAppInstalled()){
			Toast.makeText(getApplicationContext(), "未安装微信,请先去正规渠道下载安装!",
    				Toast.LENGTH_LONG).show();
			finish();
			return;
		}
		api.registerApp(Config.WX_APPID);// 注册到微信列表，没什么用

		Intent ii = getIntent();
		try {
			api.handleIntent(ii, this);
		} catch (NullPointerException e) {
			e.printStackTrace();
		}
		//TODO
		Log.e(TAG, "wwwwwww");
		if(ii.getExtras().containsKey("signFlag"))
			Log.e(TAG, ii.getExtras().getString("signFlag"));
		else
			finish();
		if(ii.getExtras().containsKey("signFlag")){
			Log.e("aaaaaa", "7");
			//signFlag
			//1 登录
			//9 分享 好友,群
			//8 发图
			//7分享朋友群
			if(ii.getExtras().getString("signFlag").equals("1")){
				ii.getExtras().remove("signFlag");
				Log.e(TAG, ii.getExtras().getString("signFlag"));
				Log.e(TAG, "signflag" + signflag);
				if(signflag == 1){
					signflag=2;
					weixinSign();
				}else if (signflag == 3){
					finish();
				}
			}else if(ii.getExtras().getString("signFlag").equals("9")){
				ii.getExtras().remove("signFlag");
				Log.e(TAG, ii.getExtras().getString("signFlag"));
				Log.e(TAG, "signflag" + signflag);
				if(signflag == 9){
					signflag=2;
					String url = ii.getExtras().getString("url");
					String title = ii.getExtras().getString("title");
					String description = ii.getExtras().getString("desc");
					shareUrl2Circle(url, title, description, 2);
					//shareUrl2Circle("https://m.jixiang.cn/friend/room/app_id/12/channel_id/10/desk_id/908618/game_id/1/room_id/377/region/220202", "三人斗地主", "房号:908618");
				}else if (signflag == 3){
					finish();
				}
				// 分享到朋友圈
			}else if(ii.getExtras().getString("signFlag").equals("7")){
				ii.getExtras().remove("signFlag");
				Log.e(TAG, ii.getExtras().getString("signFlag"));
				Log.e(TAG, "signflag" + signflag);
				if(signflag == 7){
					signflag=2;
					String url = ii.getExtras().getString("url");
					String title = ii.getExtras().getString("title");
					String description = ii.getExtras().getString("desc");
					shareUrl2Circle(url, title, description, 1);
					//shareUrl2Circle("https://m.jixiang.cn/friend/room/app_id/12/channel_id/10/desk_id/908618/game_id/1/room_id/377/region/220202", "三人斗地主", "房号:908618");
				}else if (signflag == 3){
					finish();
				}
			}else if(ii.getExtras().getString("signFlag").equals("8")){
				ii.getExtras().remove("signFlag");
				Log.e(TAG, ii.getExtras().getString("signFlag"));
				Log.e(TAG, "signflag" + signflag);
				if(signflag == 8){
					signflag=2;
					String imgurl = ii.getExtras().getString("imgurl");
					Log.d("_____imgurl", "" + imgurl);
					shareLocalPic2Cir(imgurl,0);
				}else if (signflag == 3){
					finish();
				}
			}else if(ii.getExtras().getString("signFlag").equals("10")){
				//带图分享朋友圈
				ii.getExtras().remove("signFlag");
				Log.e(TAG, ii.getExtras().getString("signFlag"));
				Log.e(TAG, "signflag" + signflag);
				if(signflag == 10){
					signflag=2;
					String imgurl = ii.getExtras().getString("imgurl");
					Log.d("_____imgurl", "" + imgurl);
					shareLocalPic2Cir(imgurl,1);
				}else if (signflag == 3){
					finish();
				}
			}
		}else{
			Log.e("aaaaaa", "8");
			finish();
		}
	}

	/**
	 * 构造一个用于请求的唯一标识
	 * @param type 分享的内容类型
	 * @return 
	 */
	private String buildTransaction(final String type) {
		return (type == null) ? String.valueOf(System.currentTimeMillis())
				: type + System.currentTimeMillis();
	}

	/**
	 * 申请授权
	 */
	private void sendAuth() {
		req = new SendAuth.Req();
		req.scope = WEIXIN_SCOPE;
		req.state = WEIXIN_STATE;
		api.sendReq(req);
		finish();
	}

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		Log.e(TAG, "onNewIntent");
		setIntent(intent);
		api.handleIntent(intent, this);
		finish();
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		if (resultCode == RESULT_OK) {
			switch (requestCode) {
			case 0x101:
				final WXAppExtendObject appdata = new WXAppExtendObject();
				final String path = "/sdcard/test.jpg";
				appdata.filePath = path;
				appdata.extInfo = "this is ext info";

				final WXMediaMessage msg = new WXMediaMessage();
				msg.setThumbImage(Util.extractThumbNail(path, 150, 150, true));
				msg.title = "this is title";
				msg.description = "this is description";
				msg.mediaObject = appdata;

				SendMessageToWX.Req req = new SendMessageToWX.Req();
				req.transaction = buildTransaction("appdata");
				req.message = msg;
				req.scene = SendMessageToWX.Req.WXSceneTimeline;
				api.sendReq(req);
				break;

			default:
				break;
			}
		}
	}

	/**
	 * 请求回调接口
	 */
	@Override
	public void onReq(BaseReq req) {
		Log.e(TAG, "onReq");
		finish(); 
	}
	
    /**
     * 请求响应回调接口
     */
	@Override
	public void onResp(BaseResp resp) {
		Log.e(TAG, "onResp");
		
		if (resp instanceof SendAuth.Resp){
			SendAuth.Resp sendAuthResp = (Resp) resp;// 用于分享时不要有这个，不能强转
			String code = sendAuthResp.code;

			Log.e(TAG, "code :" + code);

			int errCode = resp.errCode;
			if(errCode!=0){
				///ERR_OK = 0(用户同意)
				//ERR_AUTH_DENIED = -4（用户拒绝授权）
				//ERR_USER_CANCEL = -2（用户取消）
				signflag=3;
				JSONObject jsonObject = new JSONObject();
				String errMessage = "";
				if(errCode==-2){
					errMessage = "用户取消";
				}else if(errCode==-4){
					errMessage = "用户拒绝授权";
				}
				Toast.makeText(this, /*"errCode = " + errCode +*/ errMessage, Toast.LENGTH_LONG).show();
				try {
					jsonObject.put("code", errCode);
					jsonObject.put("message", errMessage);
				} catch (JSONException e) {
					e.printStackTrace();
				}
				if(errCode==0)
					Sdk_Wechat.weixinCB(jsonObject.toString());
				finish();
			}else{
				getResult(code);
			}
		}else{
			//微信分享
			switch (resp.errCode) {
	        case BaseResp.ErrCode.ERR_OK:
		            //分享成功
	        	Toast.makeText(getApplicationContext(), "分享成功",
	    				Toast.LENGTH_LONG).show();
		            break;
		        case BaseResp.ErrCode.ERR_USER_CANCEL:
		        	Toast.makeText(getApplicationContext(), "取消分享",
		    				Toast.LENGTH_LONG).show();
		        default:
		            break;
		    }
			
			JSONObject jsonObject = new JSONObject();
			try {
				jsonObject.put("code", resp.errCode);
				jsonObject.put("message", "");
			} catch (JSONException e) {
				e.printStackTrace();
			}
			if(resp.errCode==BaseResp.ErrCode.ERR_OK)
				Sdk_Wechat.weixinCB(jsonObject.toString());
			finish();
			
		}
	}

	/**
	 * 获取openid accessToken值用于后期操作
	 * @param code 请求码
	 */
	private void getResult(final String code) {
		// TODO 改为返回code 和IOS一样的流程..
		if(true){
			JSONObject json = new JSONObject();
			try {
				json.put("token", code);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			Sdk_Wechat.weixinCB_Login(json.toString());
		}
	}

	/**
	 * 
	 */
	private void shareLocalPic2Cir(String picPath,int flag) {
		
		String imgUri = picPath;
		Log.d("_____imgurl", imgUri);
//		// 文件
		String name = "sdcard/yl_" + System.currentTimeMillis() + ".jpg";
		FileOutputStream fos = null;
		Log.d("_____imgurl", name);
		FileInputStream inStream = null;
		try {
			File tempFile =new File(imgUri.trim());
	        String fileName = tempFile.getName();

			try {
				inStream = openFileInput(fileName);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			Bitmap bmp = BitmapFactory.decodeStream(inStream);
			fos = new FileOutputStream(name);
			if (null != fos) {
				bmp.compress(Bitmap.CompressFormat.JPEG, 18, fos);
				fos.flush();
				fos.close();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		Log.d("_____imgurl", name);
		
		//TODO 判断图片是否存在
		WXImageObject imageObject = new WXImageObject();
		imageObject.setImagePath(name);

		WXMediaMessage msg = new WXMediaMessage();
		msg.mediaObject = imageObject;


		Log.e("1111", "11");
		Bitmap bmp = BitmapFactory.decodeFile(name);

		Bitmap thumb = Bitmap.createScaledBitmap(bmp, 120, 120, false);
		Log.e("1111", "12");
		bmp.recycle();
		msg.thumbData = Util.bmpToByteArray(thumb, true);
		Log.e("1111", "13");
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("img");
		req.message = msg;
		//req.scene = SendMessageToWX.Req.WXSceneSession;
		if(flag==1)
			req.scene = SendMessageToWX.Req.WXSceneTimeline;// 表示发送场景为朋友圈，这个代表分享到朋友圈
		else
			req.scene = SendMessageToWX.Req.WXSceneSession;
		//req.scene = SendMessageToWX.Req.WXSceneSession;
		Log.e("1111", "14");
		boolean flagx = api.sendReq(req);
		Log.e("shareLocalPic2Cir", String.valueOf(flagx));
		finish();
	}

	/**
	 * @param url 要分享的链接
	 */
	public void shareUrl2Circle(final String url,String title,String description, int flag) {
		
		Log.e("shareUrl2Circle", url);
		Log.e("shareUrl2Circle", title);
		Log.e("shareUrl2Circle", description);
		Log.e("shareUrl2Circle", flag+"");
		WXWebpageObject webpage = new WXWebpageObject();
		webpage.webpageUrl = url;
		WXMediaMessage msg = new WXMediaMessage(webpage);
		msg.title = title;
		msg.description = description;

		Bitmap thumbBmp = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
		
		Bitmap thumb = Bitmap.createScaledBitmap(thumbBmp, 100, 100, true);
		
		msg.thumbData = Util.bmpToByteArray(thumb, true);
		
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("webpage");
		req.message = msg;
		if(flag==1)
			req.scene = SendMessageToWX.Req.WXSceneTimeline;// 表示发送场景为朋友圈，这个代表分享到朋友圈
		else
			req.scene = SendMessageToWX.Req.WXSceneSession;
		boolean flagx = api.sendReq(req);
		Log.e("shareUrl2Circle", String.valueOf(flagx));
		finish();
	}

	/**
	 * @param text 要分享的文字 
	 * flag 1 朋友圈 2好友
	 */
	private void shareText2Circle(String text,int flag) {
		WXTextObject textObj = new WXTextObject();
		textObj.text = text;

		// 用WXTextObject对象初始化一个WXMediaMessage对象
		WXMediaMessage msg = new WXMediaMessage();
		msg.mediaObject = textObj;
		// 发送文本类型的消息时，title字段不起作用
		// msg.title = "Will be ignored";
		msg.title = "分享文字标题";
		msg.description = text;

		// 构造一个Req
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("text"); // transaction字段用于唯一标识一个请求
		req.message = msg;

		if(flag==1)
			req.scene = SendMessageToWX.Req.WXSceneTimeline;// 表示发送场景为朋友圈，这个代表分享到朋友圈
		else
			req.scene = SendMessageToWX.Req.WXSceneSession;
		// req.scene = SendMessageToWX.Req.WXSceneSession;//表示发送场景为好友对话，这个代表分享给好友
		// req.scene = SendMessageToWX.Req.WXSceneTimeline;// 表示发送场景为收藏，这个代表添加到微信收藏
		// 调用api接口发送数据到微信 
		api.sendReq(req);
	}
	
}
