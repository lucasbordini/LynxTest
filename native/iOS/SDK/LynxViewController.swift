//
//  LynxView.swift
//  DevApp
//
//  Created by Lucas Bordini on 14/04/25.
//
import SwiftUI
import UIKit

public class LynxViewController: UIViewController {
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        let lynxView = LynxView { builder in
            builder.config = LynxConfig(provider: DemoLynxProvider())
            builder.screenSize = self.view.frame.size
            builder.fontScale = 1.0
        }
        
        lynxView.preferredLayoutWidth = self.view.frame.size.width
        lynxView.preferredLayoutHeight = self.view.frame.size.height
        lynxView.layoutWidthMode = .exact
        lynxView.layoutHeightMode = .exact
        
        self.view.addSubview(lynxView)
        
        lynxView.loadTemplate(fromURL: "main.lynx", initData: nil)
    }
}

public struct LynxViewRepresentable: UIViewControllerRepresentable {
    
    
    public typealias UIViewControllerType = LynxViewController
    
    public init(){}
    
    public func makeUIViewController(context: Context) -> LynxViewController {
        LynxViewController()
    }
    
    public func updateUIViewController(_ uiViewController: LynxViewController, context: Context) {
        // Do nothing
    }
    
    
}


