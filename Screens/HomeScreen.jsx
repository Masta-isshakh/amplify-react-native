import React, { useState } from 'react';
import { View, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadData } from 'aws-amplify/storage';

export default function HomeScreen() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fonction pour choisir un fichier (image, PDF, etc.)
  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // tu peux mettre "image/*" si tu veux seulement des images
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        Alert.alert('Aucun fichier choisi');
        return;
      }

      const selectedFile = result.assets[0];
      setFile(selectedFile);
      console.log('Fichier sélectionné :', selectedFile);
    } catch (error) {
      console.error('Erreur lors du choix du fichier:', error);
      Alert.alert('Erreur lors du choix du fichier');
    }
  };

  // Fonction pour uploader le fichier sur AWS Amplify Storage
  const handleUpload = async () => {
    if (!file) {
      Alert.alert('Veuillez choisir un fichier avant de télécharger.');
      return;
    }

    try {
      setUploading(true);

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const result = await uploadData({
        path: `menu/${file.name}`,
        data: blob,
      }).result;

      Alert.alert('Fichier téléchargé avec succès !');
      console.log('Résultat de l’upload :', result);
    } catch (error) {
      console.error('Erreur lors du téléchargement :', error);
      Alert.alert('Erreur lors du téléchargement du fichier.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ marginTop: 100, alignItems: 'center' }}>
      <Button title="Choisir un fichier" onPress={handleChooseFile} />
      <View style={{ height: 20 }} />
      <Button title="Uploader sur AWS" onPress={handleUpload} disabled={uploading} />
      <View style={{ marginTop: 20 }}>
        {uploading && <ActivityIndicator size="large" color="blue" />}
        {file && (
          <Image
            source={{ uri: file.uri }}
            style={{ width: 150, height: 150, marginTop: 20, borderRadius: 10 }}
          />
        )}
      </View>
    </View>
  );
}
