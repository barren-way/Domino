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

#import "RootViewController.h"
#import "cocos2d.h"
#import "ImagePickerViewController.h"

#include "platform/CCApplication.h"
#include "platform/ios/CCEAGLView-ios.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#ifdef CC_SDK_DUN
#import <QiSuDunSdk/XQiSuDunManager.h>
#endif
#include <cocos/base/CCScheduler.h>

@implementation RootViewController

/*
// The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
// Custom initialization
}
return self;
}
*/

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Set EAGLView as view of RootViewController
    self.view = (__bridge CCEAGLView *)cocos2d::Application::getInstance()->getView();
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}


// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAll;
}
#endif

- (BOOL) shouldAutorotate {
    return YES;
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}


////////////////////////////////////////////////----sdk----////////////////////////////////////////////////////

//????????????????????????????????????
static int force_roomId=0;

static NSString* m_uid = nil;
static NSString* m_room = nil;
static NSString* m_lastSendAudioPath = nil;
static NSString* m_lastRecvAudioPath = nil;
static bool m_playing=false;

//????????????
static NSURL* m_url=nil;
static NSString* m_playerId=@"";
RootViewController* save_instance=nil;

static inline NSString * AFContentTypeForPathExtension(NSString *extension) {
    #ifdef __UTTYPE__
        NSString *UTI = (__bridge_transfer NSString *)UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, (__bridge CFStringRef)extension, NULL);
        NSString *contentType = (__bridge_transfer NSString *)UTTypeCopyPreferredTagWithClass((__bridge CFStringRef)UTI, kUTTagClassMIMEType);
        if (!contentType) {
            return @"application/octet-stream";
        } else {
            return contentType;
        }
    #else
    #pragma unused (extension)
        return @"application/octet-stream";
    #endif
}

//gps?????????
CLLocationManager *lcManager=nil;

+ (void)Sdk_Init {
    if ([CLLocationManager locationServicesEnabled]) {
        // ???????????????????????????
        lcManager = [[CLLocationManager alloc] init];
        // ????????????
        lcManager.delegate = self;
        // ?????????????????????????????? (?????????????????????????????????????????????????????????????????????????????????????????????)
        lcManager.distanceFilter = 10;
        // ??????????????????(?????????????????????)
        lcManager.desiredAccuracy = kCLLocationAccuracyBest;
        // ????????????????????????????????????
        //[lcManager startUpdatingLocation];
        
        if ([lcManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
            [lcManager requestWhenInUseAuthorization];
        }
    }
}

+ (void)Sdk_openUrl:(NSString*)url
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
}

+ (void)Sdk_showToast:(NSString*)txt
{
    
}

+ (void)Sdk_getGpsPosition
{
    [lcManager requestLocation];
}

//room id
+ (int)Sdk_getRoomNum
{
    return force_roomId;
}

+ (void)saveInstance:(RootViewController*)instance
{
    save_instance=instance;
}

////////////////////////////////////////////////////////////////////////////////////////////// wechat //////////////////////////////////////////////////////////////////////////////////////////////////////

+ (void)Sdk_WechatLogin
{
    SendAuthReq* req =[[[SendAuthReq alloc ] init ] autorelease ];
    req.scope = @"snsapi_userinfo" ;
    req.state = @"asionspace_qmpyh" ;
    //????????????????????????????????????SendAuthReq????????????
    [WXApi sendReq:req completion:nil];
}

+ (void)Sdk_WechatShareUrl:(NSString*)title Share_title:(NSString*)txt Share_url:(NSString*)url
{
    WXMediaMessage* message = [WXMediaMessage message];
    message.title=title;
    message.description=txt;
    [message setThumbImage:[UIImage imageNamed:@"icon.png"]];

    WXWebpageObject * obj=[WXWebpageObject object];
    obj.webpageUrl=url;
    message.mediaObject=obj;

    SendMessageToWXReq* req =[[SendMessageToWXReq alloc] init];
    req.bText=NO;
    req.message=message;
    req.scene=WXSceneSession;

    [WXApi sendReq:req completion:nil];
}

+ (void)Sdk_WechatShareImg:(NSString*)path
{
    WXMediaMessage* message = [WXMediaMessage message];
    
    UIImage* image=[UIImage imageNamed:path];
    UIGraphicsBeginImageContext(CGSizeMake(160,90));
    [image drawInRect:CGRectMake(0, 0,160,90)];
    UIImage *reSizeImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    [message setThumbImage:reSizeImage];
    
    WXImageObject * obj=[WXImageObject object];
    NSData* data=UIImageJPEGRepresentation(image,0.4);
    obj.imageData=data;
    message.mediaObject=obj;
    
    SendMessageToWXReq* req =[[SendMessageToWXReq alloc] init];
    req.bText=NO;
    req.message=message;
    req.scene=WXSceneSession;
    [WXApi sendReq:req completion:nil];
}

+ (void)Sdk_WechatShareFriends:(NSString*)title Share_title:(NSString*)txt Share_url:(NSString*)url
{
   WXMediaMessage* message = [WXMediaMessage message];
   message.title=title;
   message.description=txt;
   [message setThumbImage:[UIImage imageNamed:@"icon.png"]];
   
   WXWebpageObject * obj=[WXWebpageObject object];
   obj.webpageUrl=url;
   message.mediaObject=obj;
   
   SendMessageToWXReq* req =[[SendMessageToWXReq alloc] init];
   req.bText=NO;
   req.message=message;
   req.scene=WXSceneTimeline;
   
    [WXApi sendReq:req completion:nil];
}

+ (void)Sdk_WechatShareImgFriends:(NSString*)path
{
  WXMediaMessage* message = [WXMediaMessage message];
  
  UIImage* image=[UIImage imageNamed:path];
  UIGraphicsBeginImageContext(CGSizeMake(160,90));
  [image drawInRect:CGRectMake(0, 0,160,90)];
  UIImage *reSizeImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  [message setThumbImage:reSizeImage];
  
  WXImageObject * obj=[WXImageObject object];
  NSData* data=UIImageJPEGRepresentation(image,0.4);
  obj.imageData=data;
  message.mediaObject=obj;
  
  SendMessageToWXReq* req =[[SendMessageToWXReq alloc] init];
  req.bText=NO;
  req.message=message;
  req.scene=WXSceneTimeline;
  [WXApi sendReq:req completion:nil];}

+ (void)Sdk_MowangLogin
{
    
}

+ (void)shareScreenShot:(NSString*)img_path;
{
    
}

/** ????????????????????????????????????*/
+(void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    CLLocation *location = [locations firstObject];
    
    NSString* ns_fun_name=@"cc.director.emit";
    NSString* ns_event=@"event_location";
    NSString* ns_1=[NSString stringWithFormat:@"%f",location.coordinate.longitude];
    NSString* ns_2=[NSString stringWithFormat:@"%f",location.coordinate.latitude];
    
    std::string str_name= [ns_fun_name UTF8String];
    std::string str_event= [ns_event UTF8String];
    std::string str_1= [ns_1 UTF8String];
    std::string str_2= [ns_2 UTF8String];
    
    std::string jsCallStr = cocos2d::StringUtils::format("%s(\"%s\",\"%s\",\"%s\");",str_name.c_str(),str_event.c_str(),str_1.c_str(),str_2.c_str());
    NSLog(@"jsCallStr = %s",jsCallStr.c_str());
    
    se::Value *ret = new se::Value();
    cocos2d::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str() , -1 , ret);
    });
}

/** ?????????????????????????????????*/
+(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSString* ns_fun_name=@"cc.director.emit";
    NSString* ns_event=@"event_location";
    NSString* ns_l=@"0";
    NSString* ns_2=@"0";
    
    std::string str_name= [ns_fun_name UTF8String];
    std::string str_event= [ns_event UTF8String];
    std::string str_1= [ns_l UTF8String];
    std::string str_2= [ns_2 UTF8String];
    
    std::string jsCallStr = cocos2d::StringUtils::format("%s(\"%s\",\"%s\",\"%s\");",str_name.c_str(),str_event.c_str(),str_1.c_str(),str_2.c_str());
    NSLog(@"jsCallStr = %s",jsCallStr.c_str());
    
    se::Value *ret = new se::Value();
    cocos2d::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str() , -1 , ret);
    });
}

+(NSString*)Sdk_getPackageVersion{
    NSDictionary* infoDictionary=??[[NSBundle??mainBundle]??infoDictionary];
    NSString* app_Version=??[infoDictionary??objectForKey:@"CFBundleShortVersionString"];
    if(app_Version){
        return app_Version;
    }else{
        return @"1.0.0";
    }
}

+ (int)Sdk_getDunPort:(int)port
{
#ifdef CC_SDK_DUN
    NSString *portString = [NSString stringWithFormat:@"%d", port];	
    NSString* valueString = [DUN_PORTS??objectForKey:portString];
    int new_port = XQiSuDunManagerOpen(valueString,port);
    return new_port;
#else
    return 0;
#endif
}

+ (NSString*)Sdk_getUserIp
{
#ifdef CC_SDK_DUN
    return XQiSuDunGetUserIP();
#else
    return @"";
#endif
}

//////////////////////////////////////////////////////////////////// ym ////////////////////////////////////////////////////////////////////////////

+ (void)ym_startRecordAudio{
#ifdef CC_SDK_YOUME
    if(!m_room){
        return;
    }
    //????????????????????????
    unsigned long long reqID=0;
    reqID = [[YIMClient GetInstance] StartRecordAudioMessage:m_room chatType:YIMChatType_RoomChat recognizeText:true isOpenOnlyRecognizeText:false callback:^(YIMErrorcodeOC errorcode, NSString *text, NSString *audioPath, unsigned int audioTime, unsigned int sendTime, bool isForbidRoom, int reasonType, unsigned long long forbidEndTime) {
        if(errorcode == YouMeIMCode_Success){
            if(m_lastSendAudioPath){
                [m_lastSendAudioPath release];
                m_lastSendAudioPath=audioPath;
                [m_lastSendAudioPath retain];
            }else{
                m_lastSendAudioPath=audioPath;
                [m_lastSendAudioPath retain];
            }
            [RootViewController playMyVoiceMessage];
        }
    } startSendCallback:^(YIMErrorcodeOC errorcode, NSString *text, NSString *audioPath, unsigned int audioTime) {
        NSLog(@"startSendCallback");
    }];
#endif
}

+ (void)ym_stopAndSendAudio{
#ifdef CC_SDK_YOUME
    [[YIMClient GetInstance] StopAndSendAudioMessage:@""];
#endif
}

+ (void)ym_cancelRecordAudio{
#ifdef CC_SDK_YOUME
    [[YIMClient GetInstance] CancleAudioMessage];
#endif
}

+ (void)ym_login:(NSString*)u_id
{
#ifdef CC_SDK_YOUME
    if(m_uid){
        [m_uid release];
        m_uid = [u_id stringByAppendingString: @"_ios"];
        [m_uid retain];
    }else{
        m_uid = [u_id stringByAppendingString: @"_ios"];
        [m_uid retain];
    }
    
    [[YIMClient GetInstance] Login:m_uid password:m_uid token:@"" callback:^(YIMErrorcodeOC errorcode, NSString *userID) {
        if(errorcode == YouMeIMCode_Success){
            NSLog(@"?????????????????????????????????");
        }else{
            NSLog(@"??????????????????????????????????????????");
        }
    }];
#endif
}

+ (void)ym_joinChatRoom:(NSString*)r_id
{
#ifdef CC_SDK_YOUME
    if(m_room){
        [m_room release];
        m_room=r_id;
        [m_room retain];
    }else{
        m_room=r_id;
        [m_room retain];
    }
    
    [[YIMClient GetInstance] JoinChatRoom:m_room callback:^(YIMErrorcodeOC errorcode, NSString *roomID) {
        if(errorcode == YouMeIMCode_Success){
            NSLog(@"??????????????????");
        }else{
            NSLog(@"?????????????????????%d",errorcode);
        }
    }];
#endif
}

+ (void)ym_leaveChatRoom
{
#ifdef CC_SDK_YOUME
    if(m_room){
        [[YIMClient GetInstance] LeaveChatRoom:m_room callback:^(YIMErrorcodeOC errorcode, NSString *roomID) {
            if(errorcode == YouMeIMCode_Success){
                NSLog(@"??????????????????");
            }else{
                NSLog(@"?????????????????????%d",errorcode);
            }
        }];
        [m_room release];
    }
    m_room=nil;
#endif
}

#ifdef CC_SDK_YOUME
- (void) OnRecvMessage:(YIMMessage*) pMessage{
    if(pMessage.messageBody.messageType == YIMMessageBodyType_TXT){
        //????????????????????????
    }else if(pMessage.messageBody.messageType == YIMMessageBodyType_Voice){
        //????????????????????????
        YIMMessageBodyAudio *vMessage = (YIMMessageBodyAudio *)pMessage.messageBody;
        //??????????????????
        [[YIMClient GetInstance] DownloadAudio:pMessage.messageID strSavePath:[RootViewController createUniqFilePath] callback:^(YIMErrorcodeOC errorcode, YIMMessage *msg, NSString *savePath) {
            
            if(m_lastRecvAudioPath){
                [m_lastRecvAudioPath release];
                m_lastRecvAudioPath=savePath;
                [m_lastRecvAudioPath retain];
            }else{
                m_lastRecvAudioPath=savePath;
                [m_lastRecvAudioPath retain];
            }
            [RootViewController playMyVoiceMessage];
        }];
    }
    else if (pMessage.messageBody.messageType == YIMMessageBodyType_File ){
     
    }
    else if  (pMessage.messageBody.messageType == YIMMessageBodyType_Gift ){
       
    }
    else if ( pMessage.messageBody.messageType == YIMMessageBodyType_CustomMesssage ){
      
    }
}
#endif

+(NSString*)createUniqFilePath{
    NSArray *cachePaths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    NSString *cachePath = [cachePaths objectAtIndex:0];
    
    NSString *fullCachePath = [cachePath stringByAppendingPathComponent:@"YIMVoiceCache"];
    NSString *fileName = [NSString stringWithFormat:@"%@.wav", [[NSUUID UUID] UUIDString]];
    BOOL isDir = FALSE;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL isDirExist = [fileManager fileExistsAtPath:fullCachePath
                                        isDirectory:&isDir];
    if(!isDirExist){
        BOOL bCreateDir = [fileManager createDirectoryAtPath:fullCachePath
                                 withIntermediateDirectories:YES
                                                  attributes:nil
                                                       error:nil];
        
        if(!bCreateDir){
            NSLog(@"YIM Create Audio Cache Directory Failed.");
        }
        
        NSLog(@"%@",fullCachePath);
    }
    return [fullCachePath stringByAppendingPathComponent:fileName];
}

+(void)playMyVoiceMessage
{
#ifdef CC_SDK_YOUME
    if(m_playing){
        return;
    }
    NSString* str_path=nil;
    if(m_lastSendAudioPath){
        str_path=m_lastSendAudioPath;
        m_lastSendAudioPath=nil;
    }else{
        if(m_lastRecvAudioPath){
            str_path=m_lastRecvAudioPath;
            m_lastRecvAudioPath=nil;
        }
    }
    
    if(!str_path){
        return;
    }
    
    m_playing=true;
    
    [[YIMClient GetInstance] StartPlayAudio:str_path callback:^(YIMErrorcodeOC errorcode, NSString *path) {
        m_playing=false;
        [RootViewController playMyVoiceMessage];
    }];
    [str_path release];
#endif
}

//photo avatar
+ (void)Sdk_openPhoto:(NSString*)url UserId:(NSString*)id
{
    if(url&&id){
        if(m_url){
            [m_url release];
            m_url=[NSURL URLWithString:url];
            [m_url retain];
        }else{
            m_url=[NSURL URLWithString:url];
            [m_url retain];
        }
        m_playerId=id;
        [RootViewController openPhoto];
    }
}

+ (void)openPhoto
{
    ImagePickerViewController* imagePickerViewController = [[ImagePickerViewController alloc] initWithNibName:nil bundle:nil];
    RootViewController* _viewController=(RootViewController*)save_instance;
    [_viewController.view addSubview:imagePickerViewController.view];
    [imagePickerViewController localPhoto];
}

+ (void)openCamera
{
    ImagePickerViewController* imagePickerViewController = [[ImagePickerViewController alloc] initWithNibName:nil bundle:nil];
    RootViewController* _viewController=(RootViewController*)save_instance;
    [_viewController.view addSubview:imagePickerViewController.view];
    [imagePickerViewController takePhoto];
}

+ (void)sendPhoto:(NSString*)path
{
    if(m_url&&m_playerId){
        //?????????????????????
        NSString *TWITTERFON_FORM_BOUNDARY = @"d45j6h5h6jk367jkh7k354545555";
        //??????url?????????request
        NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:m_url
                                                               cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                           timeoutInterval:10];
        //????????? --d45j6h5h6jk367jkh7k354545555
        NSString *MPboundary=[[NSString alloc]initWithFormat:@"--%@",TWITTERFON_FORM_BOUNDARY];
        //????????? d45j6h5h6jk367jkh7k354545555--
        NSString *endMPboundary=[[NSString alloc]initWithFormat:@"%@--",MPboundary];
        
        //??????????????????
        UIImage *image=[UIImage imageWithContentsOfFile:path];
        //???????????????data
        NSData* data = UIImagePNGRepresentation(image);
        //http body????????????
        NSMutableString *body=[[NSMutableString alloc]init];
        //????????????????????????
        [body appendFormat:@"%@\r\n",MPboundary];
        //????????????????????????2???
        [body appendFormat:@"Content-Disposition: form-data; name=\"id:%@\"\r\n\r\n",m_playerId];
        //??????????????????
        [body appendFormat:@"%@\r\n",@"1"];
        
//        //????????????????????????key?????????
//        NSArray *keys= [params allKeys];
//
//        //??????keys
//        for(int i=0;i<[keys count];i++)
//        {
//            //????????????key
//            NSString *key=[keys objectAtIndex:i];
//            //??????key??????pic?????????value????????????????????????name???Boris
//            if(![key isEqualToString:@"pic"])
//            {
//                //????????????????????????
//                [body appendFormat:@"%@\r\n",MPboundary];
//                //????????????????????????2???
//                [body appendFormat:@"Content-Disposition: form-data; name=\"%@\"\r\n\r\n",key];
//                //??????????????????
//                [body appendFormat:@"%@\r\n",[params objectForKey:key]];
//            }
//        }
        
        //??????????????????
        NSString *contentType = AFContentTypeForPathExtension([path pathExtension]);
        
        ////????????????????????????
        [body appendFormat:@"%@\r\n",MPboundary];
        //??????pic?????????????????????boris.png
        [body appendFormat:@"Content-Disposition: form-data; name=\"imgfile\"; filename=\"%@.png\"\r\n",m_playerId];
        //???????????????????????????
        [body appendFormat:@"Content-Type: %@\r\n\r\n",contentType];
        
        //??????????????????--AaB03x--
        NSString *end=[[NSString alloc]initWithFormat:@"\r\n%@",endMPboundary];
        //??????myRequestData???????????????http body
        NSMutableData *myRequestData=[NSMutableData data];
        //???body??????????????????UTF8??????????????????
        [myRequestData appendData:[body dataUsingEncoding:NSUTF8StringEncoding]];
        //???image???data??????
        [myRequestData appendData:data];
        //???????????????--AaB03x--
        [myRequestData appendData:[end dataUsingEncoding:NSUTF8StringEncoding]];
        
        
        //??????HTTPHeader???Content-Type??????
        NSString *content=[[NSString alloc]initWithFormat:@"multipart/form-data; boundary=%@",TWITTERFON_FORM_BOUNDARY];
        //??????HTTPHeader
        [request setValue:content forHTTPHeaderField:@"Content-Type"];
        //??????Content-Length
        [request setValue:[NSString stringWithFormat:@"%d", [myRequestData length]] forHTTPHeaderField:@"Content-Length"];
        //??????http body
        [request setHTTPBody:myRequestData];
        //http method
        [request setHTTPMethod:@"POST"];
        
        //3.????????????
        [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse * __nullable response, NSData * __nullable data, NSError * __nullable connectionError) {
            
            //4.??????????????????????????????
            if (connectionError) {
                NSLog(@"--????????????-");
            }else
            {
                NSLog(@"upload success");
                [self photoEventCallback:@"success"];
            }
        }];
        
        NSLog(@"upload start");
        [self photoEventCallback:@"start"];
    }
}

+(void)photoEventCallback:(NSString *)event
{
    NSString* ns_fun_name=@"cc.director.emit";
    NSString* ns_event=@"eventupload";

    std::string str_name= [ns_fun_name UTF8String];
    std::string str_event= [ns_event UTF8String];
    std::string str_1= [event UTF8String];
    
    std::string jsCallStr = cocos2d::StringUtils::format("%s(\"%s\",\"%s\");",str_name.c_str(),str_event.c_str(),str_1.c_str());
    NSLog(@"jsCallStr = %s",jsCallStr.c_str());
    
    se::Value *ret = new se::Value();
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str() , -1 , ret);
}

+ (void)CopyText:(NSString*)copyStr
{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = copyStr;
}


//////////////////////////////////////////////////////////////////// callback ////////////////////////////////////////////////////////////////////////////

//????????????
- (void)WechatCall_login:(NSString*)str
{
    NSString* ns_fun_name=@"cc.director.emit";
    NSString* ns_event=@"event_wechat_login";
 
    std::string str_name= [ns_fun_name UTF8String];
    std::string str_event= [ns_event UTF8String];
    std::string str_code= [str UTF8String];
    
    std::string jsCallStr = cocos2d::StringUtils::format("%s(\"%s\",\"%s\");",str_name.c_str(),str_event.c_str(),str_code.c_str());
    NSLog(@"jsCallStr = %s",jsCallStr.c_str());
    
    se::Value *ret = new se::Value();
    cocos2d::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str() , -1 , ret);
    });
}

//????????????
- (void)WechatCall_share
{
    NSString* ns_fun_name=@"cc.director.emit";
    NSString* ns_event=@"event_wechat_share";
    NSString* ns_result=@"success";
    
    std::string str_name= [ns_fun_name UTF8String];
    std::string str_event= [ns_event UTF8String];
    std::string str_result= [ns_result UTF8String];
    
    std::string jsCallStr = cocos2d::StringUtils::format("%s(\"%s\",\"%s\");",str_name.c_str(),str_event.c_str(),str_result.c_str());
    NSLog(@"jsCallStr = %s",jsCallStr.c_str());
    
    se::Value *ret = new se::Value();
    cocos2d::Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str() , -1 , ret);
    });
}

@end

