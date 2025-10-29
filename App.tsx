// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GalleryScreen from "./src/GalleryScreen";
import UploadScreen from "./src/UploadScreen";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import Notification from "./Screens/NotificationScreen";

Amplify.configure(outputs);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Notification" component={Notification} />
        <Tab.Screen name="More" component={UploadScreen} />
      </Tab.Navigator>
    </NavigationContainer>

  );
}
