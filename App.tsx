import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeProvider, useTheme } from "./src/utils/UI/CustomThemeProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList, DarkTheme, LightTheme } from "./src/Constants";
import HomeScreen from "./src/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RoastingScreen from "./src/screens/RoastingScreen";
import PermissionsPage from "./src/screens/PermissionsScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

function AppContent() {
  const { theme } = useTheme();

  return (
    <GluestackUIProvider mode={theme}>
      <SafeAreaProvider>

        <NavigationContainer theme={theme === 'light' ? LightTheme : DarkTheme}>

          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>

            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ gestureEnabled: false }}
            />

            <Stack.Screen
              name="Roasting"
              component={RoastingScreen}
              options={{ gestureEnabled: true, headerShown: false }}
            />

            <Stack.Screen
            name="Permissions"
            component={PermissionsPage}
            options={{ gestureEnabled: false }}
            
            />


          </Stack.Navigator>

        </NavigationContainer>

      </SafeAreaProvider>


    </GluestackUIProvider>
  );
}

function App() {
  return <ThemeProvider><AppContent /></ThemeProvider>
}

export default App;