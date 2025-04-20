//
//  ViewController.swift
//  ReadyRemitLynxSDK
//
//  Created by Lucas Bordini on 15/04/25.
//

import SwiftUI
import UIKit

class LynxViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let lynxView = LynxView { [weak self] builder in
            guard let self else { return }
            builder.config = LynxConfig(provider: DemoLynxProvider())
            builder.screenSize = view.frame.size
            builder.fontScale = 1.0
        }
        
        lynxView.preferredLayoutWidth = view.frame.size.width
        lynxView.preferredLayoutHeight = view.frame.size.height
        lynxView.layoutWidthMode = .exact
        lynxView.layoutHeightMode = .exact
        
        view.addSubview(lynxView)
        
        lynxView.loadTemplate(fromURL: "main.lynx", initData: nil)
        
    }
}

struct LynxViewRepresentable: UIViewControllerRepresentable {
    
    typealias UIViewControllerType = LynxViewController
    
    func makeUIViewController(context: Context) -> LynxViewController {
        LynxViewController()
    }
    
    func updateUIViewController(_ uiViewController: LynxViewController, context: Context) {
        // do nothing
    }
    
    
}
