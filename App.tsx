import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json"; // ⚠️ vérifie le chemin

import UploadScreen from "./src/UploadScreen";
import GalleryScreen from "./src/GalleryScreen";

Amplify.configure(outputs); // ⚡ obligatoire avant tout usage d’Amplify

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Gallery">
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ title: "Produits" }}
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: "Ajouter un produit" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
