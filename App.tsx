// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import GalleryScreen from "./src/GalleryScreen";
import UploadScreen from "./src/UploadScreen";  
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ title: "🖼️ Images publiées" }}
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: "📤 Publier une image" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
