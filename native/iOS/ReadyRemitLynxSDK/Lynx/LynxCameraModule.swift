//
//  CameraModule.swift
//  ReadyRemitLynxSDK
//
//  Created by Lucas Bordini on 16/04/25.
//


import Foundation
import AVFoundation
import UIKit

@objcMembers
public final class CameraModule: NSObject, LynxModule, AVCapturePhotoCaptureDelegate {
    
    
    @objc public static var name: String = "CameraModule"
    
    @objc public static var methodLookup: [String : String] = [
        "takePicture": NSStringFromSelector(#selector(takePicture)),
        "startPreview": NSStringFromSelector(#selector(startPreview)),
        "stopPreview": NSStringFromSelector(#selector(stopPreview)),
        "requestCameraPermission": NSStringFromSelector(#selector(requestCameraPermission))
    ]
    
    @objc required public override init() {
        super.init()
    }
    
    @objc required public init(param: Any) {
        super.init()
    }
    
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private var photoOutput: AVCapturePhotoOutput?
    private var previewView: UIView?
    private var captureSemaphore: DispatchSemaphore?  // para sincronizar captura de foto
    private var capturedImageData: Data?              // armazena dados da foto capturada
    
    /// Requests permission to use the camera and returns true if the user authorized it.
    @objc func requestCameraPermission() -> Bool {
        let status = AVCaptureDevice.authorizationStatus(for: .video)
        if status == .authorized {
            return true  // já autorizado
        } else if status == .denied || status == .restricted {
            return false // negado previamente ou restrito
        }
        
        // Caso não determinado, solicitar acesso de forma assíncrona
        var grantedPermission = false
        let semaphore = DispatchSemaphore(value: 0)
        AVCaptureDevice.requestAccess(for: .video) { granted in
            grantedPermission = granted
            semaphore.signal()
        }
        // Aguarda o usuário responder (não executar na thread principal para não travar a UI)
        _ = semaphore.wait(timeout: .distantFuture)
        return grantedPermission
    }
    
    /// Inicia a pré-visualização da câmera com AVCaptureSession e AVCaptureVideoPreviewLayer.
    @objc func startPreview() {
        // Evita reinicializar se já estiver em execução
        if let session = captureSession, session.isRunning {
            return
        }
        // Configura a sessão de captura
        let session = AVCaptureSession()
        guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
            print("Câmera traseira não disponível")
            return
        }
        do {
            let input = try AVCaptureDeviceInput(device: camera)
            if session.canAddInput(input) {
                session.addInput(input)
            }
        } catch {
            print("Erro ao configurar entrada da câmera: \(error.localizedDescription)")
            return
        }
        // Configura a saída para captura de fotos
        let photoOutput = AVCapturePhotoOutput()
        if session.canAddOutput(photoOutput) {
            session.addOutput(photoOutput)
            self.photoOutput = photoOutput
        }
        // Cria o layer de preview e adiciona sobre a janela principal
        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.videoGravity = .resizeAspectFill
        // Obtém a UIWindow principal para sobrepor o preview
        guard let window = UIApplication.shared.windows.first else {
            print("Janela principal não encontrada")
            return
        }
        // Cria uma view para conter o layer de preview (ocupando a tela toda)
        let previewView = UIView(frame: window.bounds)
        previewLayer.frame = previewView.bounds
        previewView.layer.addSublayer(previewLayer)
        // Sobrepõe a view de preview sobre a janela (acima da interface Lynx)
        window.addSubview(previewView)
        
        // Guarda referências e inicia a captura
        self.captureSession = session
        self.previewLayer = previewLayer
        self.previewView = previewView
        session.startRunning()
    }
    
    /// Encerra o preview da câmera, parando a sessão e removendo a camada de preview.
    @objc func stopPreview() {
        captureSession?.stopRunning()
        captureSession = nil
        // Remove o layer de preview da interface
        previewLayer?.removeFromSuperlayer()
        previewLayer = nil
        // Remove a view de preview sobreposta
        previewView?.removeFromSuperview()
        previewView = nil
        // Limpa saída de foto
        photoOutput = nil
    }
    
    /// Captura uma foto da câmera e retorna a imagem em Base64 (ou caminho do arquivo).
    @objc func takePicture() -> String {
        guard let photoOutput = self.photoOutput else {
            print("Sessão de câmera não inicializada")
            return ""
        }
        // Configurações da foto (pode ajustar flash, resolução etc. conforme necessário)
        let settings = AVCapturePhotoSettings()
        settings.flashMode = .auto
        
        // Use um semáforo para aguardar o callback assíncrono da captura da foto
        captureSemaphore = DispatchSemaphore(value: 0)
        capturedImageData = nil
        // Inicia a captura da foto
        DispatchQueue.main.async {
            photoOutput.capturePhoto(with: settings, delegate: self)
        }
        // Aguarda até a foto ser capturada e processada (não travar a UI thread)
        _ = captureSemaphore?.wait(timeout: .distantFuture)
        
        // Gera string Base64 a partir dos dados da imagem capturada (se houver)
        guard let imageData = capturedImageData else {
            return ""
        }
        let base64String = imageData.base64EncodedString()
        // Opcional: salvar em arquivo e retornar o caminho, por exemplo:
        // let filename = "foto_\(Int(Date().timeIntervalSince1970)).jpg"
        // let url = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(filename)
        // try? imageData.write(to: url)
        // return url.path
        return base64String
    }
    
    // Delegate callback chamado quando a captura da foto for concluída
    public func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        defer {
            // Libera o semáforo para continuar a execução de takePicture()
            captureSemaphore?.signal()
        }
        if let error = error {
            print("Erro ao capturar foto: \(error.localizedDescription)")
            return
        }
        // Obtém os dados da imagem (JPEG) capturada
        if let imageData = photo.fileDataRepresentation() {
            self.capturedImageData = imageData
        }
    }
}
