import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Image, FlatList, Text, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadData, downloadData } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

export default function HomeScreen() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);  // tableau des images+desc

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission accès images',
          message: 'L’app a besoin d’accéder à vos images',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async () => {
    const ok = await requestPermission();
    if (!ok) {
      Alert.alert('Permission refusée');
      return;
    }

    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('Picker error', response.errorMessage);
        return;
      }
      const asset = response.assets[0];
      setFile(asset);
    });
  };

  const handleUpload = async () => {
    if (!file || !description) {
      Alert.alert('Veuillez choisir une image et entrer une description');
      return;
    }
    try {
      const res = await fetch(file.uri);
      const blob = await res.blob();
      const path = `uploads/${Date.now()}-${file.fileName || 'image.jpg'}`;

      const result = await uploadData({
        path,
        data: blob,
        options: {
          metadata: { description }
        }
      }).result;

      // stockage local de l’item
      setItems([ ...items, { description, uri: file.uri, key: result.key } ]);
      Alert.alert('Succès', 'Image uploadée');
      setFile(null);
      setDescription('');
    } catch (err) {
      console.error('Erreur upload', err);
      Alert.alert('Erreur', 'Echec upload');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <Text>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Choisir image" onPress={pickImage} />
      <TextInput
        placeholder="Entrez description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Uploader" onPress={handleUpload} />
      <FlatList
        data={items}
        keyExtractor={(i) => i.key}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginVertical:8 },
  image: { width:100, height:100, borderRadius:8 },
  item: { marginVertical:8, alignItems:'center' },
});
