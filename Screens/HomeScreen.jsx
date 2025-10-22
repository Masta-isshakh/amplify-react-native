import React, { useState } from 'react';
import { View, Button, Image, Alert, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadData } from 'aws-amplify/storage';

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fonction pour choisir une image dans la galerie
  const handleChooseImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          Alert.alert('Aucune image sélectionnée');
        } else if (response.errorCode) {
          Alert.alert('Erreur :', response.errorMessage);
        } else {
          const selectedImage = response.assets[0];
          setImage(selectedImage);
          console.log('Image sélectionnée :', selectedImage);
        }
      }
    );
  };

  // Fonction pour uploader sur AWS S3 via Amplify Storage
  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Veuillez choisir une image avant d’uploader.');
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const result = await uploadData({
        path: `images/${image.fileName}`,
        data: blob,
      }).result;

      Alert.alert('Image uploadée avec succès !');
      console.log('Résultat upload :', result);
    } catch (error) {
      console.error('Erreur upload :', error);
      Alert.alert('Erreur lors de l’upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ marginTop: 100, alignItems: 'center' }}>
      <Button title="Choisir une image" onPress={handleChooseImage} />
      <View style={{ height: 20 }} />
      <Button title="Uploader sur AWS" onPress={handleUpload} disabled={uploading} />
      <View style={{ marginTop: 20 }}>
        {uploading && <ActivityIndicator size="large" color="blue" />}
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{
              width: 200,
              height: 200,
              marginTop: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
          />
        )}
      </View>
    </View>
  );
}
