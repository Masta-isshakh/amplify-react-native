import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileScreen = () => {
  return (
    <View style={styles.root}>
      <Text style={styles.header}>Profile</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    root: {
    paddingTop: 50,
    alignItems: "center",
  },
    header: {
    fontSize: 24,
    fontWeight: "bold",
  },
})