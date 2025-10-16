import React from "react";
import { Button, View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import TodoList from "./src/TodoList";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import NotificationScreen from "./Screens/NotificationScreen";
import MoreScreen from "./Screens/MoreScreen";


Amplify.configure(outputs);

const Tab = createBottomTabNavigator();



const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <NavigationContainer>
          <Tab.Navigator screenOptions={({route})=>({
            headerShown:false,
            tabBarActiveBackgroundColor:"#dbb6b6ff",
            tabBarInactiveBackgroundColor:"#000000ff",
            tabBarShowLabel:true,
            tabBarLabelStyle:{
              fontSize:14,
              fontWeight:600,
              margin:4
            },
            tabBarIconStyle:{
              margin:3
            },
            tabBarIcon:({focused, color, size})=>{
              let iconName;
              if(route.name==='Home'){
                iconName=focused?'home':'home-outline';
              }else if(route.name==='Profile'){
                iconName=focused?'person':'person-outline';
              }else if(route.name==='Notification'){
                iconName=focused?'notifications':'notifications-outline';
              }else if(route.name==='More'){
                iconName=focused?'menu':'menu-outline';
              }
              return<Ionicons name={iconName} size={size+10} color={color}/>;
            },
            tabBarActiveTintColor:'black',
            tabBarInactiveTintColor:'gray',
                tabBarStyle: {
                  height:120,

    },
          })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen}/>
            <Tab.Screen name="Notification" component={NotificationScreen}/>
            <Tab.Screen name="More" component={MoreScreen}/>
          </Tab.Navigator>
        </NavigationContainer>
      </Authenticator>
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor:"#fff"
  },

});

export default App;