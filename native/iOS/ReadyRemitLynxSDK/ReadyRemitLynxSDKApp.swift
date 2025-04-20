//
//  ReadyRemitLynxSDKApp.swift
//  ReadyRemitLynxSDK
//
//  Created by Lucas Bordini on 15/04/25.
//

import SwiftUI

@main
struct ReadyRemitLynxSDKApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            LynxViewRepresentable()
        }
    }
}
