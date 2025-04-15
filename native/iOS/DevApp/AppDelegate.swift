//
//  AppDelegate.swift
//  DevApp
//
//  Created for DevApp
//

import UIKit
import SwiftUI
import Lynx

class AppDelegate: NSObject, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        // Configurações iniciais do aplicativo
        print("AppDelegate: didFinishLaunchingWithOptions")

        return true
    }
    
    func applicationWillResignActive(_ application: UIApplication) {
        // Chamado quando o aplicativo está prestes a mudar do estado ativo para inativo
        print("AppDelegate: applicationWillResignActive")
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        // Chamado quando o aplicativo entra em background
        print("AppDelegate: applicationDidEnterBackground")
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
        // Chamado quando o aplicativo está prestes a entrar em foreground
        print("AppDelegate: applicationWillEnterForeground")
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        // Chamado quando o aplicativo se torna ativo
        print("AppDelegate: applicationDidBecomeActive")
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        // Chamado quando o aplicativo está prestes a ser encerrado
        print("AppDelegate: applicationWillTerminate")
    }
}
