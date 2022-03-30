package org.cocos2dx.javascript;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.provider.Settings;
import android.util.Log;
import org.cocos2dx.javascript.service.SDKClass;
import org.cocos2dx.javascript.uploadimg.FormFile;
import org.cocos2dx.javascript.uploadimg.HttpService;
import org.cocos2dx.javascript.uploadimg.ImagePicker;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

//js调用Android原生功能的逻辑接口处理类
public class Sdk_Event extends SDKClass {

    private static Context mainActive = null;
    private static int upload_photo = 0;
    public static String url_icon = "";
    public static String player_id = "";
    private static AppActivity m_app = null;

    @Override
    public void init(Context context) {
        mainActive = context;
        m_app = AppActivity.getInstance();
        ImagePicker.getInstance().init(m_app);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        ImagePicker.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    //打开相册
    public static void openPhoto(final String url, final String id) {
        upload_photo = 1;
        url_icon = url;
        player_id = id;

        ImagePicker.getInstance().openPhoto();
    }

    //图片上传服务器回调处理
    public static void getPhotoCallback(final String str_path) {
        if (url_icon == "") {
            return;
        }

        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize = 1;

        Bitmap bitmap = BitmapFactory.decodeFile(str_path, options);
        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        // 压缩图片
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
        byte[] byte_arr = stream.toByteArray();

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("id:" + player_id, "1");
        FormFile[] files = new FormFile[1];
        files[0] = new FormFile(player_id + ".png", byte_arr, "imgfile", "multipart/form-data;");
        HttpService.postHttpImageRequest(url_icon, params, files, new HttpService.HttpCallBackListener() {
            public void onFinish(String response) {
                Log.d("response", response.toString());
                //上传成功
                m_app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        if (upload_photo > 0) {
                            Log.d("uploadstate", "success");
                            String result = "success";
                            Cocos2dxJavascriptJavaBridge.evalString("cc.director.emit(\"eventupload\",\"" + result.toString() + "\");");
                            upload_photo = 0;
                        }
                    }
                });
            }

            public void onError(Exception e) {
                //上传失败
                Log.d("uploadstate", "fail");
            }
        });
    }

    //文本复制
    public static void CopyText(final String str) {
        m_app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ClipboardManager cm = (ClipboardManager) m_app.getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData clip = ClipData.newPlainText("kk",str);
                cm.setPrimaryClip(clip);
            }
        });
    }

    /**
     * 监听GPS
     */
    public static void openGPS() {
        // 转到手机设置界面，用户设置GPS
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        m_app.startActivityForResult(intent,0); // 设置完成后返回到原来的界面
    }
}
