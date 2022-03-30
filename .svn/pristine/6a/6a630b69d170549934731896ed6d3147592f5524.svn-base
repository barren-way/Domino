package org.cocos2dx.javascript.uploadimg;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.javascript.Sdk_Event;

public class ImagePicker {

    public static final int NONE = 0;
    public static final int PHOTOHRAPH = 1;        // 拍照
    public static final int PHOTOZOOM = 2;        // 缩放
    public static final int PHOTORESOULT = 3;    // 结果
    public static final String IMAGE_UNSPECIFIED = "image/*";

    private static ImagePicker instance = null;
    private static Activity activity = null;
    private static boolean is_crop = true;

    public static void onImageSaved(String path) {
        Sdk_Event.getPhotoCallback(path);
    }

    public static ImagePicker getInstance() {
        if (instance == null) {
            instance = new ImagePicker();
        }
        return instance;
    }

    // 初始化
    public void init(Activity activity) {
        ImagePicker.activity = activity;
    }

    // 打开相册
    static public void openPhoto() {
        Intent intent = new Intent(Intent.ACTION_PICK, null);
        intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, IMAGE_UNSPECIFIED);
        activity.startActivityForResult(intent, PHOTOZOOM);
    }

    // 打开相机
    static public void openCamera() {
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(new File(activity.getFilesDir(), "@cc_cameraCache.jpg")));
        activity.startActivityForResult(intent, PHOTOHRAPH);
    }

    // 回调
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d("resultCode:", "" + resultCode);
        Log.d("requestCode:", "" + requestCode);
        if (resultCode == NONE)
            return;

        // 拍照
        if (requestCode == PHOTOHRAPH) {
            File picture = new File(activity.getFilesDir() + "/@cc_cameraCache.jpg");
            startPhotoZoom(Uri.fromFile(picture));
        }

        if (data == null)
            return;

        // 读取相册缩放图片
        if (requestCode == PHOTOZOOM) {
            if (is_crop) {
                startPhotoZoom(data.getData());
            } else {
                sendImg(data.getData());
            }
        }

        // 处理结果
        if (requestCode == PHOTORESOULT) {
            Bundle extras = data.getExtras();
            if (extras != null) {
                Bitmap photo = extras.getParcelable("data");
                String path = activity.getFilesDir() + "/@ci_" + UUID.randomUUID().toString() + ".jpg";
                saveMyBitmap(path, photo);

                // 通知C++层已保存图片 并返回路径
                onImageSaved(path);
            }
        }
    }

    //直接发送图片（找不到裁切intent的情况下）
    public void sendImg(Uri data) {
        if (data != null) {
            try {
                Bitmap photo = MediaStore.Images.Media.getBitmap(activity.getContentResolver(), data);
                photo = Bitmap.createScaledBitmap(photo, 132, 132, true);
                String path = activity.getFilesDir() + "/@ci_" + UUID.randomUUID().toString() + ".jpg";
                saveMyBitmap(path, photo);
                onImageSaved(path);
            } catch (FileNotFoundException file_e) {
                Toast.makeText(activity, file_e.getMessage(), Toast.LENGTH_SHORT).show();
            } catch (IOException io_e) {
                Toast.makeText(activity, io_e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        }
    }

    public void startPhotoZoom(Uri uri) {
        try {
            Intent intent = new Intent("com.android.camera.action.CROP");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            }
            intent.setDataAndType(uri, IMAGE_UNSPECIFIED);
            intent.putExtra("crop", "true");
            intent.putExtra("aspectX", 1);
            intent.putExtra("aspectY", 1);
            intent.putExtra("outputX", 132);
            intent.putExtra("outputY", 132);
            intent.putExtra("return-data", true);
            activity.startActivityForResult(intent, PHOTORESOULT);
        } catch (Exception e) {
            openPhoto();
            is_crop = false;
            Toast.makeText(activity, e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    public void saveMyBitmap(String filePath, Bitmap mBitmap) {
        File f = new File(filePath);
        try {
            f.createNewFile();
        } catch (IOException e) {
        }
        FileOutputStream fOut = null;
        try {
            fOut = new FileOutputStream(f);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        mBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fOut);
        try {
            fOut.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            fOut.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}