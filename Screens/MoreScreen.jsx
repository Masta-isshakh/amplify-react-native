import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react-native";



const MoreScreen = () => {
  const SignOutButton = () => {
  const { signOut } = useAuthenticator();
  return (
    <View style={styles.signoutButton}>
      <Button title="SignOut" onPress={signOut} />
    </View>
  )
};
  return (
    <View>
      <View style={styles.root}>
        <Text style={styles.header}>More</Text>
      </View>
      <SignOutButton/>
    </View>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  root: {
    paddingTop: 50,
    alignItems: "center",
  },
  signoutButton:{
    width:100,
    marginLeft:20
  }
});
