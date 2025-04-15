//
//  DevAppApp.swift
//  DevApp
//
//  Created by Lucas Bordini on 14/04/25.
//

import SwiftUI
import UIKit

@main
struct DevAppApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
