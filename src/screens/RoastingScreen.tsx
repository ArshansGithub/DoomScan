import React, { useEffect, useState, useRef, useCallback } from 'react';
import { runOnJS } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { GoogleGenAI, LiveServerMessage, Modality, Session } from '@google/genai';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { View } from '@/components/ui/view';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { getBase64 } from '../utils/FrameProcessor';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../Constants';
import { Button, ButtonText } from '@/components/ui/button';
import { Platform } from 'react-native';
import { Worklets } from 'react-native-worklets-core';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_API_KEY;
console.log(`API_KEY: ${GEMINI_API_KEY}`);

export function RoastingScreen(): React.ReactElement {
  console.log('RoastingScreen component rendering...');

  const [hasPermission, setHasPermission] = useState(false);
  const [isRoasting, setIsRoasting] = useState(false);
  const session = useRef<Session | undefined>(undefined);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const lastFrameSentAt = useRef<number>(Date.now());
  const waitingInterval = 2000; // milliseconds

  const logFunc = Worklets.createRunOnJS(console.log);

  useEffect(() => {
    console.log('Requesting camera permission...');
    (async () => {
      try {
        const status = await Camera.requestCameraPermission();
        console.log('Camera permission status:', status);
        if (status === 'denied') {
          console.log('Permission denied, navigating to Permissions screen...');
          navigation.replace('Permissions');
        }
        setHasPermission(status === 'granted');
        console.log('Permission set to:', status === 'granted');
      } catch (error) {
        console.log('Error requesting camera permission:', error);
      }
    })();
  }, [navigation]);

  useEffect(() => {
    if (audioUrl) {
      console.log('Play audio effect triggered with URL:', audioUrl);
      (async () => {
        try {
          console.log('Setting audio mode...');
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          });
          const newSound = new Audio.Sound();
          console.log('Loading sound from URL:', audioUrl);
          await newSound.loadAsync({ uri: audioUrl }, { shouldPlay: true });
          console.log('Sound loaded, setting position to 0...');
          await newSound.setPositionAsync(0);
          console.log('Playing sound...');
          soundRef.current = newSound;
          await newSound.playAsync();
          console.log('Sound playing...');
        } catch (error) {
          console.log('Error playing audio:', error);
        }
      })();
    }
  }, [audioUrl]);

  const startGeminiSession = useCallback(async () => {
    console.log('Starting Gemini session...');
    try {
      const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
        httpOptions: { apiVersion: 'v1alpha' },
      });

      let resolveOnOpen: () => void;
      const onOpenPromise = new Promise<void>((resolve) => {
        resolveOnOpen = resolve;
      });

      const newSession = await ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        config: {
          responseModalities: [Modality.AUDIO],
        },
        callbacks: {
          onopen: () => {
            console.log('Connected to Gemini websocket.');
            resolveOnOpen(); // signal that the connection is open
          },
          onmessage: (message: LiveServerMessage) => {
            console.log('Received Gemini message:', JSON.stringify(message));
            if (
              message.serverContent &&
              message.serverContent.modelTurn &&
              message.serverContent.modelTurn.parts &&
              message.serverContent.modelTurn.parts.length > 0 &&
              message.serverContent.modelTurn.parts[0].inlineData &&
              message.serverContent.modelTurn.parts[0].inlineData.data
            ) {
              console.log('Processing Gemini message inline data...');
              const audioData = message.serverContent.modelTurn.parts[0].inlineData.data;
              const audioBuffer = new Uint8Array(new TextEncoder().encode(audioData)).buffer;
              const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
              const newAudioUrl = URL.createObjectURL(audioBlob);
              console.log('New audio URL from Gemini:', newAudioUrl);
              setAudioUrl(newAudioUrl);
            } else {
              console.log('Gemini message does not contain inline audio data.');
            }
          },
          onerror: (e: ErrorEvent) => {
            console.log('Gemini session error:', e);
          },
          onclose: (e: CloseEvent) => {
            console.log('Gemini session closed.');
          },
        },
      });

      await onOpenPromise;
      session.current = newSession;
      console.log('Gemini session started.');

      newSession.sendClientContent({
        turns: {
          parts: [
            {
              text:
                'Your goal is to roast humans shown in the images who are "doom-scrolling" which is where they are endlessly scrolling through social media feeds. Roast them by making fun of their social media habits and the type of personalized content that appears on their feed. Make sure to be funny and engaging to keep the audience entertained. Capitalize off of the fact that they are addicted to social media and are likely to be easily offended. Additionally, capitlize off the content that appears on their feed to make the roast more personal and engaging. For example make sure to dramatize unfunny content, adult content, or content that is out of touch with the times.',
            },
          ],
        },
        turnComplete: true,
      });
    } catch (error) {
      console.log('Error starting Gemini session:', error);
    }
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (lastFrameSentAt.current && Date.now() - lastFrameSentAt.current < waitingInterval) {
      return; // Skip frame if interval has not elapsed.
    }
    const base64 = getBase64(frame);
    if (session && isRoasting) {
      logFunc('Sending frame to Gemini...');
      session.current?.sendRealtimeInput({
        media: {
          data: base64,
          mimeType: 'image/jpeg',
        },
      });
      lastFrameSentAt.current = Date.now();
      logFunc('Frame sent at:', lastFrameSentAt.current);
    }
  }, [session, isRoasting]);

  const handleRoastingButton = useCallback(async () => {
    console.log('Roasting button pressed.');
    if (!isRoasting) {
      console.log('Starting roasting...');
      setIsRoasting(true);
      if (!session.current) {
        console.log('No session exists, starting Gemini session...');
        await startGeminiSession();
      }
    } else {
      console.log('Stopping roasting...');
      setIsRoasting(false);
      if (session.current) {
        console.log('Closing Gemini session...');
        session.current.close();
      }
    }
  }, [isRoasting, startGeminiSession]);

  const meme = useCallback(async () => {
    session.current?.sendClientContent({
      turns: {
        parts: [
          {
            text:
              'Hello! I am a test message from the client. I am testing the ability to send messages from the client to the server. This is a test message. This is only a test. If this were a real message, you would be instructed to take cover. This is a test. This is only a test.',
          },
        ],
      },
      turnComplete: true,
    });
    console.log('Meme function invoked.');
  }, []);

  const playMemeSound = async () => {
    console.log('Playing meme sound...');
    const soundObject = new Audio.Sound();
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      await soundObject.loadAsync(require('@/src/assets/meme.mp3'));
      await soundObject.playAsync();
    } catch (error) {
      console.log('Error playing meme sound:', error);
    }
  };

  console.log('Rendering component UI...');
  if (!device || !hasPermission) {
    console.log('Device not ready or permission not granted. Showing loading state.');
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Camera
        device={device}
        ref={cameraRef}
        isActive={isRoasting}
        style={{ width: '100%', height: '100%' }}
        frameProcessor={frameProcessor}
      />
      <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button onPress={handleRoastingButton} className="bg-blue-500 p-2 rounded-full shadow-md">
          <ButtonText className="text-white text-lg font-bold">
            {isRoasting ? 'Stop Roasting' : 'Start Roasting'}
          </ButtonText>
        </Button>
        <Button onPress={meme}>
          <ButtonText>Test Gemini</ButtonText>
        </Button>
        <Button onPress={playMemeSound}>
          <ButtonText>Test Sound</ButtonText>
        </Button>
      </View>
    </View>
  );
}

export default RoastingScreen;