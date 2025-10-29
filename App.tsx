import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";

import UploadScreen from "./src/UploadScreen";
import GalleryScreen from "./src/GalleryScreen";

// ⚙️ Configuration Amplify (obligatoire avant tout usage)
Amplify.configure(outputs);

// Création du Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Admin"
        screenOptions={{
          headerStyle: { backgroundColor: "#0077b6" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Admin"
          component={UploadScreen}
          options={{ title: "Page Administrateur" }}
        />
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ title: "Produits" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
