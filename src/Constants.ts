import { Theme } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Constants from 'expo-constants';
import { Subscription } from "expo-modules-core";

export type AppStackParamList = {
    Home: undefined;
    Roasting: undefined;
    Permissions: undefined;
  };

  export interface FailedRequest {
    error: string;
    status: number;
}

export interface ErrorHandlerOptions {
    actionName: string;
    error: AxiosError;
    showModal?: boolean;
    showToast?: boolean;
};

export interface ToastOptions {
    title: string;
    description?: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
    placement?:
    | "top"
    | "bottom"
    | "top left"
    | "top right"
    | "bottom left"
    | "bottom right";
};

export type OpenToastFunction = (options: ToastOptions) => void;
export type OpenModalFunction = (options: ModalConfig) => void;

export interface ErrorHandlerOptions {
    actionName: string;
    error: AxiosError;
    showModal?: boolean;
    showToast?: boolean;
    openModal: OpenModalFunction;
    openToast: OpenToastFunction;
}

export interface ToastContextType {
    openToast: (options: ToastOptions) => void;
};

export interface ModalConfig {
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

export interface ModalContextProps {
    isOpen: boolean;
    config: ModalConfig | null;
    openModal: (config: ModalConfig) => void;
    closeModal: () => void;
}

export const LightTheme: Theme = {
    dark: false,
    colors: {
        primary: '#010101', // systemBlue
        background: '#F2F2F7', // systemBackground (light)
        card: '#FFFFFF', // systemCard (light)
        text: '#1C1C1E', // primary text (dark)
        border: '#D8D8DC', // separator (light)
        notification: '#FF3B30', // systemRed
    },
};

export const DarkTheme: Theme = {
    dark: true,
    colors: {
        primary: '#FFFFFF', // systemBlue (dark mode)
        background: '#010101', // systemBackground (dark)
        card: '#1A202C', // systemGray6 (dark)
        text: '#E5E5E7', // primary text (light on dark)
        border: '#272729', // separator (dark)
        notification: '#FF453A', // systemRed (dark mode)
    },
};
