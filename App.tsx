import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json"; // ⚠️ vérifie le chemin
import Ionicons from "react-native-vector-icons/Ionicons";


import UploadScreen from "./src/UploadScreen";
import GalleryScreen from "./src/GalleryScreen";
import { uploadData } from "aws-amplify/storage";
import { Authenticator } from "@aws-amplify/ui-react-native";
import ProductDetail from "./src/ProductDetail";
import ProfileScreen from "./Screens/ProfileScreen";
import MoreScreen from "./Screens/MoreScreen";
import NotificationScreen from "./Screens/NotificationScreen";


Amplify.configure(outputs); // ⚡ obligatoire avant tout usage d’Amplify

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator(){
  return(
    <Tab.Navigator 
    screenOptions={({route})=>({
      headerShown:false,
      tabBarShowLabel:true,
      tabBarIcon:({color, size})=>{
        let iconName;

        if (route.name === "Home") {
          iconName="grid-outline";
        } else if (route.name==="Profile"){
          iconName="person-outline";
        }else if (route.name==="More"){
          iconName="menu-outline";
        }else if(route.name==="Notification"){
          iconName="notifications-outline";
        }
        return <Ionicons name={iconName} size={22} color={color}/>
      },

      tabBarActiveTintColor:"#007AFF",
      tabBarInactiveTintColor:"gray",
    })}

    >
      <Tab.Screen name="Home" component={GalleryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen}/>
      <Tab.Screen name="More" component={MoreScreen}/>
      <Tab.Screen name="Notification" component={NotificationScreen}/>
    </Tab.Navigator>
  );
}

function MainStack(){
  return (
    <Stack.Navigator>
      {/*les tabs comme ecran principal */}
      <Stack.Screen name="Home" component={TabNavigator} options={{headerShown:false}}/>
      <Stack.Screen name="Gallery" component={GalleryScreen}/>
      <Stack.Screen name="Upload" component={UploadScreen}/>
      <Stack.Screen name="ProductDetail" component={ProductDetail}/>
    </Stack.Navigator>
      

  );
}

export default function App() {
  return (
    <Authenticator.Provider>
      <Authenticator>
    <NavigationContainer>
      <MainStack/>
    </NavigationContainer>
    </Authenticator>
    </Authenticator.Provider>
  );
}
