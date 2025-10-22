import React, { useState, useEffect } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { Alert, Button, View } from 'react-native';

  export default function HomeScreen() {
    const [file, setFile]=useState();

    const HandleChange = (event) =>{
      setFile(event.target.files [0]);
    };
    handleClick = ()=>{
      if (!file) {
        Alert.alert("aucun file coisi")
      }
      uploadData({
        path: `menu/${file.name}`,
        data: file,  
          });
    };

  
    return(
      <View>
          <Button onPress={HandleChange} title='choose file'/>
          <Button onPress={handleClick} title='upload'/>
      </View>
      

    )
  }
