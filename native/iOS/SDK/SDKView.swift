//
//  SDKView.swift
//  DevApp
//
//  Created by Lucas Bordini on 14/04/25.
//

import SwiftUI


public struct SDKView: View {
    
    
    public init() {
        LynxEnv.sharedInstance()
    }
    
    public var body: some View {
        NavigationStack {
            VStack {
                Text("Wanna see a LynxView ?")
                NavigationLink("Let's see it", destination: { RRMLynxView() })
            }
        }
    }
}
