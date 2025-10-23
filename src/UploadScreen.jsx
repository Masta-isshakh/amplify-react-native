// screens/UploadScreen.js
import React, { useState } from "react";
import { View, Button, Image, Alert, ActivityIndicator, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadData } from "aws-amplify/storage";


export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChooseImage = () => {
    launchImageLibrary(
      { mediaType: "photo", includeBase64: false },
      (response) => {
        if (response.didCancel) {
          // utilisateur a annulé
        } else if (response.errorCode) {
          Alert.alert("Erreur", response.errorMessage || "Erreur inconnue");
        } else if (response.assets && response.assets.length > 0) {
          setImage(response.assets[0]);
        }
      }
    );
  };

  const handleUpload = async () => {
  if (!image || !image.uri) {
    Alert.alert("Erreur", "Veuillez choisir une image avant d’uploader.");
    return;
  }

  try {
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = await response.blob();

    const fileName = image.fileName || `image_${Date.now()}.jpg`;

    // 📤 Upload dans le dossier public/images/
    await uploadData({
      path: `public/images/${fileName}`,
      data: blob,
      options: { contentType: image.type || "image/jpeg" },
    }).result;

    Alert.alert("✅ Image publiée avec succès !");
    setImage(null);
    navigation.navigate("Gallery");
  } catch (err) {
    console.error("Erreur upload :", err);
    Alert.alert("Erreur lors de l’upload.");
  } finally {
    setUploading(false);
  }
};


  return (
    <View style={{ marginTop: 60, alignItems: "center", paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        📤 Publier une image
      </Text>

      <Button title="Choisir une image" onPress={handleChooseImage} />
      <View style={{ height: 18 }} />
      <Button title="Uploader" onPress={handleUpload} disabled={uploading} />

      <View style={{ marginTop: 18, alignItems: "center" }}>
        {uploading && <ActivityIndicator size="large" />}
        {image && typeof image.uri === "string" && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200, marginTop: 12, borderRadius: 8 }}
            onError={(e) => console.warn("Preview image error:", e.nativeEvent)}
          />
        )}
      </View>
    </View>
  );
}
