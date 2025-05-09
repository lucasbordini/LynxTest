//
//  UIHelper.h
//  ReadyRemitLynxSDK
//
//  Created by Lucas Bordini on 15/04/25.
//


// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIHelper : NSObject

+ (UIViewController *)getTopViewController;

+ (UIColor *)colorWithHexString:(NSString *)hexString;

@end

NS_ASSUME_NONNULL_END