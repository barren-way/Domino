//
//  QiSuDun.hpp
//  QiSuDunSdk
//
//  Created by on 2019/1/11.
//  Copyright © 2019年 . All rights reserved.
//

#ifndef QiSuDun_hpp
#define QiSuDun_hpp

#include <stdio.h>
#include <sys/types.h>

int sdk_Initialize(char * UserAccect,char* OsName,char* SystemInfo);
int sdk_InitializeSync(char * UserAccect,char* OsName,char* SystemInfo);
ushort sdk_CreateSisle(char * Arress, ushort userPort,unsigned short LocalPort);
void sdk_AllSisleClose();
const char* sdk_GetUpdateURL();
const char* sdk_GetUserIP();

void sdk_Log();

void sdk_log_Clear();
int sdk_log_GetAllDataSize();
const char* sdk_log_GetAllData();
#endif
