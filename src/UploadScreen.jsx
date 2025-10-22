// screens/UploadScreen.js
import React, { useState } from "react";
import { View, Button, Image, Alert, ActivityIndicator, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadData } from "aws-amplify/storage";

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChooseImage = async () => {
    launchImageLibrary(
      { mediaType: "photo", includeBase64: false },
      (response) => {
        if (response.didCancel) {
          Alert.alert("Aucune image sélectionnée");
        } else if (response.errorCode) {
          Alert.alert("Erreur :", response.errorMessage);
        } else {
          setImage(response.assets[0]);
        }
      }
    );
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Veuillez choisir une image avant d’uploader.");
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      await uploadData({
        path: `public/images/${image.fileName}`,
        data: blob,
      }).result;

      Alert.alert("✅ Image publiée avec succès !");
      setImage(null);

      // Redirige vers la galerie après l’upload
      navigation.navigate("Gallery");
    } catch (error) {
      console.error("Erreur upload :", error);
      Alert.alert("Erreur lors de l’upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ marginTop: 60, alignItems: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        📤 Publier une image
      </Text>
      <Button title="Choisir une image" onPress={handleChooseImage} />
      <View style={{ height: 20 }} />
      <Button title="Uploader" onPress={handleUpload} disabled={uploading} />
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
              borderColor: "#ccc",
            }}
          />
        )}
      </View>
    </View>
  );
}
