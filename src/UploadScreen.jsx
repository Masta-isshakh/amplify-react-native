import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data"; // ✅ bon import

const client = generateClient(); // ✅ sans <Schema>

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleChooseImage = () => {
    launchImageLibrary(
      { mediaType: "photo", includeBase64: false },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode)
          return Alert.alert("Erreur", response.errorMessage || "Erreur inconnue");
        if (response.assets?.length > 0) setImage(response.assets[0]);
      }
    );
  };

  const handleUpload = async () => {
    if (!image || !name || !price) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs et choisir une image.");
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const fileName = image.fileName || `image_${Date.now()}.jpg`;
      const path = `public/images/${fileName}`;

      // Upload S3
      await uploadData({
        path,
        data: blob,
        options: { contentType: image.type || "image/jpeg" },
      }).result;

      // Sauvegarde base
      await client.models.Product.create({
        name,
        price: parseFloat(price),
        imagePath: path,
        rating: 0,
      });

      Alert.alert("✅ Produit ajouté avec succès !");
      setImage(null);
      setName("");
      setPrice("");
      navigation.navigate("Gallery");
    } catch (err) {
      console.error("Erreur upload :", err);
      Alert.alert("Erreur lors de l’upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Ajouter un produit</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du produit"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix (ex: 99.99)"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button title="Choisir une image" onPress={handleChooseImage} />
      <View style={{ height: 10 }} />
      <Button title="Publier" onPress={handleUpload} disabled={uploading} />

      {uploading && <ActivityIndicator size="large" style={{ marginTop: 15 }} />}
      {image && typeof image.uri === "string" && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 60, alignItems: "center", paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  preview: {
    width: 200,
    height: 200,
    marginTop: 12,
    borderRadius: 8,
  },
});
