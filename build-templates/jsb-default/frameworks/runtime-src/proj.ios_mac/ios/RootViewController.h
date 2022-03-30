/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import <UIKit/UIKit.h>
#import <StoreKit/StoreKit.h>
#import "WXApi.h"
#import <CoreLocation/CoreLocation.h>
#ifdef CC_SDK_YOUME
#import "YIMClient.h"
@interface RootViewController : UIViewController <NSObject,CLLocationManagerDelegate,YIMCallbackProtocol>
#else
@interface RootViewController : UIViewController <NSObject,CLLocationManagerDelegate>
#endif
//init
+ (void)Sdk_Init;

//toast
+ (void)Sdk_showToast:(NSString*)txt;

//gps
+ (void)Sdk_getGpsPosition;

//room
+ (int)Sdk_getRoomNum;

//SDK打开网页
+ (void)Sdk_openUrl:(NSString*)url;

//save instance
+ (void)saveInstance:(RootViewController*)instance;

//wechat
+ (void)Sdk_WechatLogin;
+ (void)Sdk_WechatShareUrl:(NSString*)title Share_title:(NSString*)txt Share_url:(NSString*)url;
+ (void)Sdk_WechatShareImg:(NSString*)path;
+ (void)Sdk_WechatShareFriends:(NSString*)title Share_title:(NSString*)txt Share_url:(NSString*)url;
+ (void)Sdk_WechatShareImgFriends:(NSString*)path;

//mowang
+ (void)Sdk_MoWangLogin;
+ (void)shareScreenShot:(NSString*)img_path;

+ (NSString*)Sdk_getPackageVersion;

//dun
+ (int)Sdk_getHttpPort:(int)port;
+ (int)Sdk_getWsPort:(int)port;
+ (NSString*)Sdk_getUserIp;

//yim voice
+ (void)ym_startRecordAudio;
+ (void)ym_stopAndSendAudio;
+ (void)ym_cancelRecordAudio;
+ (void)ym_login:(NSString*)u_id;
+ (void)ym_joinChatRoom:(NSString*)r_id;
+ (void)ym_leaveChatRoom;

//photo avatar
+ (void)Sdk_openPhoto:(NSString*)url UserId:(NSString*)id;
+ (void)openPhoto;
+ (void)openCamera;
+ (void)sendPhoto:(NSString*)path;

//copy text
+ (void)CopyText:(NSString*)copyStr;

//callback
- (void)WechatCall_login:(NSString*)str;
- (void)WechatCall_share;

- (BOOL)prefersStatusBarHidden;
@end
