import { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '../utils/UI/CustomThemeProvider';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Button, ButtonText } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Image } from "@/components/ui/image";
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../Constants';

const icon = require("@/src/assets/IMG_0337.png");

const HomeScreen: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();


    const startRoasting = async () => {
        navigation.navigate('Roasting');
    };

    const perms = async () => {
        navigation.navigate('Permissions');
    }

    return (
        <VStack>
            <VStack className="flex justify-center items-center">
                <Image
                    width={128}
                    height={128}
                    className="mt-32 w-64 h-64"
                    source={icon}
                    alt="Profile Picture"
                />
                <Text className="font-bold text-6xl mt-6">DoomScan</Text>
                <VStack className="w-full max-w-md justify-center items-center">
                    <Text className="font-semibold text-lg text-center">
                        Roast what your friends watch in their freetime
                    </Text>
                </VStack>

                <Button onPress={startRoasting} className="mt-4 rounded-lg px-6 py-3 w-1/8 h-1/8">
                    <Text className="text-4xl text-white">Begin the roastening</Text>
                </Button>

                <Button onPress={perms} className="mt-4 rounded-lg px-6 py-3 w-1/8 h-1/8">
                    <Text className="text-4xl text-white">Permissions</Text>
                </Button>


            </VStack>

            {/* <Fab size="md" placement="bottom right" onPress={toggleTheme}>
                <FabIcon as={theme === 'light' ? MoonIcon : SunIcon} />
            </Fab> */}
        </VStack>
    );
}


export default HomeScreen;