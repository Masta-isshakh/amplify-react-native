import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json"; // ✅ chemin selon ton dossier

import GalleryScreen from "./src/GalleryScreen";
import UploadScreen from "./src/UploadScreen";

Amplify.configure(outputs); // ✅ TRÈS IMPORTANT : doit être exécuté avant toute autre utilisation d’Amplify

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Admin" component={UploadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
