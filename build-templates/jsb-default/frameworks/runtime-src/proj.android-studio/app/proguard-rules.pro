# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in E:\developSoftware\Android\SDK/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Proguard Cocos2d-x-lite for release
-keep class org.cocos2dx.** { *; }
-keep class org.cocos2dx.javascript.** { *; }
-dontwarn org.cocos2dx.**

# Proguard Dun for release
-keep public class com.qisudunsdk.** {*;}
-keep public class com.Qsu {*;}
-keep public class com.InitCallBack {*;}
-dontwarn com.qisudunsdk.**

# Proguard Apache HTTP for release
-keep class org.apache.http.** { *; }
-dontwarn org.apache.http.**

# Proguard okhttp for release
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

-keep class okio.** { *; }
-dontwarn okio.**
# Proguard Android Webivew for release. you can comment if you are not using a webview
-keep class android.net.http.SslError
-keep class android.webkit.WebViewClient

-dontwarn android.webkit.WebView
-dontwarn android.net.http.SslError
-dontwarn android.webkit.WebViewClient

# keep anysdk for release. you can comment if you are not using anysdk
-keep class com.anysdk.** { *; }
-dontwarn com.anysdk.**

-keep class com.youme.** {*;}
-keep class com.youme.imsdk.**{*;}
-keep class com.google.gson.** { *; }
-keep class com.iflytek.**
-keepattributes Signature

-keep class com.tencent.bugly.** { *; }
-dontwarn com.tencent.bugly.**

-dontwarn com.baidu.**
-keep class com.baidu.** { *;}

-keep class com.tencent.mm.opensdk.** {*;}
-keep class com.tencent.wxop.** {*;}
-keep class com.tencent.mm.sdk.** {*;}

-keep class com.umeng.** {*;}
-keepclassmembers class * {
   public <init> (org.json.JSONObject);
}
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keep class com.mostone.** { *; }
