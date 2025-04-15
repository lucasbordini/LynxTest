Pod::Spec.new do |s|
  s.name             = 'SDK'
  s.version          = '1.0.0'
  s.summary          = 'Ready Remit SDK for iOS applications'
  s.description      = <<-DESC
                       A comprehensive SDK for integrating Ready Remit functionality into iOS applications.
                       This SDK provides a seamless way to incorporate remittance features into your app.
                       DESC
  s.homepage         = 'https://github.com/Brightwell/ready-remit-sdk-lynx'
  s.license          = { :type => 'Commercial', :text => 'Proprietary and Confidential' }
  s.author           = { 'Brightwell' => 'dev@brightwell.com' }
  s.source           = { :git => 'https://github.com/BrightwellPayments/readyremit-sdk-ios.git', :branch => '9.2', :submodules => true }
  
  s.platform     = :ios, '16.0'

  
  # Include the XCFramework
  s.vendored_frameworks = 'native/iOS/build/xcframework/SDK.xcframework'
  
  # Include the bundle resource
  s.resource = 'bundle/Lynx.bundle'
  
  # Dependencies from your Podfile
  s.dependency 'Lynx', '3.2.0-rc.0'
  s.dependency 'PrimJS', '2.11.1-rc.0'
  s.dependency 'LynxService', '3.2.0-rc.0'
  s.dependency 'SDWebImage', '5.15.5'
  s.dependency 'SDWebImageWebPCoder', '0.11.0'
end
