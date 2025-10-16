import { StyleSheet, Text, View,Button } from 'react-native'
import React from 'react'
import TodoList from '../src/TodoList'
import { useAuthenticator } from '@aws-amplify/ui-react-native'
import { SafeAreaView } from 'react-native-safe-area-context';


const SignOutButton=()=>{
    const {signOut}=useAuthenticator();

    return (
        <View style={styles.signoutbutton}>
            <Button title="Sign Out" onPress={signOut}/>
        </View>
    );
};
const MoreScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TodoList/>
      <SignOutButton/>
    </SafeAreaView>
  )
}

export default MoreScreen

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    signoutbutton:{
        alignItems:"center",
        justifyContent:"center",
        marginTop:50
    }
})