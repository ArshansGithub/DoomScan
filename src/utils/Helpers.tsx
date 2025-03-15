import { AlertCircle, Bluetooth, BluetoothOff, Lock, MapPin, MapPinOff, RefreshCw } from 'lucide-react-native';
import { View } from "@/components/ui/view";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ErrorHandlerOptions, FailedRequest } from "@/src/Constants";

export const formatPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, "");
  if (digits.length <= 3) {
    return `(${digits}`;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

export const cleanPhoneNumber = (input: string): string => {
  return input.replace(/\D/g, "");
}

export const handleErrorWithModalOrToast = ({
  actionName,
  error,
  showModal = true,
  showToast = true,
  openModal,
  openToast,
}: ErrorHandlerOptions) => {
  console.log("Running handleErrorWithModalOrToast", actionName, error);

  const statusCode = error.response?.status;
  if (!statusCode) {
    const message = `${error.message}\nCode: ${error.code}`;
    if (showModal) {
      openModal({
        title: `Unexpected Error: ${error.name}`,
        message,
        type: "error",
      });
    }
    if (showToast) {
      openToast({
        title: `Unexpected Error: ${error.name}`,
        description: message,
        type: "error",
      });
    }
    return;
  }

  const errorData = error.response?.data as FailedRequest;
  const errorMessage = errorData?.error || "An error occurred.";

  if (showModal) {
    openModal({
      title: `${actionName} failed: ${statusCode}`,
      message: errorMessage,
      type: "error",
    });
  }

  if (showToast) {
    openToast({
      title: `${actionName} failed: ${statusCode}`,
      description: errorMessage,
      type: "error",
    });
  }
};

/**
 * Compares two semantic version strings.
 * Returns:
 * -1 if v1 < v2
 *  0 if v1 == v2
 *  1 if v1 > v2
 */
export const compareVersions = (v1: string, v2: string): number => {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const a = v1Parts[i] || 0;
    const b = v2Parts[i] || 0;

    if (a > b) return 1;
    if (a < b) return -1;
  }

  return 0;
};