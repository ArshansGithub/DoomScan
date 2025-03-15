import { VisionCameraProxy, Frame } from 'react-native-vision-camera'

const plugin = VisionCameraProxy.initFrameProcessorPlugin('getBase64', {})

/**
 * SALAMALAKAUMWALKWAUM SALAMMMM 
 */
export function getBase64(frame: Frame): string {
  'worklet'
  if (plugin == null) throw new Error('Failed to load Frame Processor Plugin "getBase64"!')
  return plugin.call(frame) as string;
}