
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface XQiSuDunManager : NSObject

/**
 异步初始化SDK

 @param cardNum 卡号
 @return 返回成功或失败，0成功。
 */
FOUNDATION_EXPORT int XQiSuDunManagerInIt(NSString *cardNum);

/**
 同步初始化SDK
 
 @param cardNum 卡号
 @return 返回成功或失败，0成功。
 */
FOUNDATION_EXPORT int XQiSuDunManagerInItSync(NSString *cardNum);

/**
 异步初始化SDK,成功后调用参数2通知
 
 @param cardNum 卡号
 @return 返回成功或失败，0成功。
 */
FOUNDATION_EXPORT int XQiSuDunManagerInItAsync(NSString *cardNum,void(^CellBack)(void));

/**
 打开端口

 @param sourceID 地址
 @param sourcePort 端口，欲连接的目标服务器端口
 @return 返回随机本地端口
 */
FOUNDATION_EXPORT int XQiSuDunManagerOpen(NSString *sourceID,int sourcePort);

/**
 打开端口
 
 @param sourceID 地址
 @param sourcePort 端口，欲连接的目标服务器端口
 @param LocalPort 本地端口,若为0,返回随机端口,若不为0则返回与参数一致的端口或返回-1失败
 @return 若LocalPort为0,则随机端口,若不为0则返回与参数一致的端口或返回-1失败
 */
FOUNDATION_EXPORT int XQiSuDunManagerOpen2(NSString *sourceID,int sourcePort,unsigned short LocalPort);

/**
 获取本级的外网IP
 
 @return 该接口需要配合同步初始化或异步带通知初始化使用，否则返回空
 */
FOUNDATION_EXPORT NSString* XQiSuDunGetUserIP();

/**
 关闭所有链接
 
 */
FOUNDATION_EXPORT void XQiSuDunCloseAll();


/**
私有接口

 */
void XQiSuDunInitializeCallBacl();



@end

NS_ASSUME_NONNULL_END
