import React, {useState} from "react";
import {Text, TextInput, Button, Image,ActivityIndicator, ScrollView, Alert, StyleSheet}from "react-native";
import {launchImageLibrary} from "react-native-image-picker";
import {uploadData} from "aws-amplify/storage";
import {generateClient} from "aws-amplify/data";
import type {Schema} from "../amplify/data/resource";
import { useNavigation } from "@react-navigation/native";

const client = generateClient<Schema>();

export default function UploadScreen({navigation}:any){
  const [name, setName]=useState("");
  const [description, setDescription]=useState("");
  const [price, setPrice]=useState("");
  const [oldPrice, setOldPrice]=useState("");
  const [rate, setRate]=useState("");
  const [image, setImage]=useState<any>(null);
  const [uploading, setUploading]=useState(false);

  const pickImage=()=>{
    launchImageLibrary({mediaType: "photo"}, (response)=>{
      if (response.didCancel) return ;
      if(response.errorMessage) {
        Alert.alert("Error picking image", response.errorMessage);
        return;
      }
      if(response.assets && response.assets.length > 0){
        setImage(response.assets[0]);
      }
    });
  };

  const handleAddProduct= async()=>{
    if(!name || !price || !description || !oldPrice || !rate ){
      Alert.alert("Please fill all fields");
      return;
  }
  if(!image){
    Alert.alert("Please select an image");
    return;
  }

  setUploading(true);
  try{
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const key = `products/${Date.now()}-${image.fileName || "image.jpg"}`;

    await uploadData({
      path: key,
      data:blob,
      options:{contentType: image.type || "image/jpeg"},
    }).result;

    await client.models.Product.create({
      name,
      description,
      price:parseFloat(price),
      oldPrice:oldPrice ? parseFloat(oldPrice): undefined,
      rate:rate ? parseFloat(rate): undefined,
      imagePath:key,
    });

    Alert.alert("Product added successfully");
    setName("");
    setDescription("");
    setPrice("");
    setOldPrice("");
    setRate("");
    setImage(null);
    navigation.goBack();
  } catch(err){
    console.error("Error adding product:", err);
    Alert.alert("Error", "Error adding product");
  } finally{
    setUploading(false);
  }
};

return(
  <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Products</Text>

      <TextInput
        style={styles.input}
        placeholder="product name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="oldprice"
        value={oldPrice}
        onChangeText={setOldPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="rate"
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
      />

      <Button title="choose an image" onPress={pickImage}/>

      {image && <Image source={{uri: image.uri}} style={styles.preview}/>}

      {uploading ? (
        <ActivityIndicator style={{marginTop:16}} size="large"/>
      ):(
        <Button title="add product" onPress={handleAddProduct}/>
      )}
      
  </ScrollView>
);
}

const styles=StyleSheet.create({
  container:{
    padding:20,
    backgroundColor:"#fff"
  },
  title:{
    fontSize:22,
    fontWeight:"bold",
    marginBottom:20
  },
  input:{
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:8,
    marginBottom:10,
    padding:10
  },
  preview:{
    width:200,
    height:200,
    alignSelf:"center",
    marginVertical:10,
    borderRadius:10,
  },
})