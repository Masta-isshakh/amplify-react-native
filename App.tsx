import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import { NavigationContainer } from "@react-navigation/native";
import NoificationScreen from "./Screens/NoificationScreen";
import MoreScreen from "./Screens/MoreScreen";
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import { Ionicons } from "@expo/vector-icons";
import type { IconProps } from "@expo/vector-icons/build/createIconSet";
import { createNativeStackNavigator} from "@react-navigation/native-stack";
import SubCategoryScreen from "./Screens/SubCategoryScreen";
import Products from "./Screens/Produits/Products";
import Fruits from "./Screens/Produits/SubCategory/Fruits";
import { RootStackParamList } from "./types";


Amplify.configure(outputs);

const Tab = createBottomTabNavigator();
const Stack=createNativeStackNavigator<RootStackParamList>();


//stack navigator imbrique dans l'onglet home
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="SubCategory"
        component={SubCategoryScreen}
        options={({ route }) => ({ title: route.params?.category })}
      />


      <Stack.Screen
        name="Products"
        component={Products}
        options={({ route }) => ({ title: route.params?.subCategory })}
      />
    </Stack.Navigator>
  );
}



export default function App() {
  return (
    <Authenticator.Provider>
      <Authenticator >
        <NavigationContainer>
          <Tab.Navigator screenOptions={({route}) => ({
            headerShown:false,
            tabBarActiveBackgroundColor:"orange",
            tabBarInactiveBackgroundColor:"#24221dff",
            tabBarIcon: ({focused, color, size}) =>{
              let iconName;
              if(route.name === 'Home'){
                iconName = focused ? 'home' : 'home-outline';
              }else if(route.name==='Profile'){
                iconName=focused ? 'person' : 'person-outline';
              }else if(route.name==='Notification'){
                iconName=focused? 'notifications' : 'notifications-outline';
              }else if(route.name==='More'){
                iconName=focused ?'menu':'menu-outline'
              }
              return <Ionicons name={iconName} size={size} color={color}/>;
            },
            tabBarActiveTintColor:'black',
            tabBarInactiveTintColor:'gray',
          })}>
            <Tab.Screen name="Home" component={HomeStack}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
            <Tab.Screen name="Notification" component={NoificationScreen}/>
            <Tab.Screen name="More" component={MoreScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </Authenticator>
    </Authenticator.Provider>
  );
}




const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#fff",
}


});
