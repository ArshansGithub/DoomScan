import VisionCamera
import VideoToolbox

@objc(Base64ConvertFramePlugin)
public class Base64ConvertFramePlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }
  
  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    let buffer = frame.buffer
    let orientation = frame.orientation
    
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(buffer) else {
            return nil
        }
        
        // 2. Create a CGImage using the hardware-accelerated VideoToolbox API.
        var cgImage: CGImage?
        let result = VTCreateCGImageFromCVPixelBuffer(pixelBuffer, options: nil, imageOut: &cgImage)
        guard result == kCVReturnSuccess, let image = cgImage else {
            return nil
        }
        
        // 3. Convert the CGImage to a UIImage.
        let uiImage = UIImage(cgImage: image)
        
        // 4. Convert the UIImage to JPEG data.
        guard let imageData = uiImage.jpegData(compressionQuality: 0.7) else { return nil }
        
        // 5. Encode the data to a base64 string.
        return imageData.base64EncodedString(options: .lineLength64Characters)
  }
}
