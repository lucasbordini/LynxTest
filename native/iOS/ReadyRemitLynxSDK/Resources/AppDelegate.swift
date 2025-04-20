//
//  AppDelegate.swift
//  ReadyRemitLynxSDK
//
//  Created by Lucas Bordini on 15/04/25.
//
import SwiftUI
import Lynx

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        let lynxEnv = LynxEnv.sharedInstance()
        
        // Enable Lynx Debug
        lynxEnv.lynxDebugEnabled = true
        // Enable Lynx DevTool
        lynxEnv.devtoolEnabled = true
        // Enable Lynx LogBox
        lynxEnv.logBoxEnabled = true
        lynxEnv.config.registerUI(LynxExplorerInput.self, withName: "input")
        lynxEnv.config.register(CameraModule.self)
        return true
    }
}
