import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NoificationScreen = () => {
  return (
    <View style={styles.root}>
      <Text style={styles.header}>Noification</Text>
    </View>
  )
}

export default NoificationScreen

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