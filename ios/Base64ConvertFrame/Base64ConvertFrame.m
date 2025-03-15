#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("DoomScan/DoomScan-Swift.h")
#import "DoomScan/DoomScan-Swift.h"
#else
#import "DoomScan-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(Base64ConvertFramePlugin, getBase64)