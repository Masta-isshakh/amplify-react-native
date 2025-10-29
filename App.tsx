import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json"; // fichier généré par amplify push
import UploadScreen from "./src/UploadScreen";
import GalleryScreen from "./src/GalleryScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

Amplify.configure(outputs);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Gallery">
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
