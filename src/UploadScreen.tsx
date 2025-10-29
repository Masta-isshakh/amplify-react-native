import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { generateClient } from "aws-amplify/data";
import { uploadData } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

export default function UploadScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [rate, setRate] = useState("");
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert("Erreur", response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleAddProduct = async () => {
    if (!name || !price) {
      Alert.alert("Erreur", "Le nom et le prix sont obligatoires");
      return;
    }
    if (!image) {
      Alert.alert("Erreur", "Veuillez choisir une image");
      return;
    }

    setUploading(true);
    try {
      // 1️⃣ Upload image vers S3
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const key = `products/${Date.now()}-${image.fileName || "image.jpg"}`;

      await uploadData({
        path: key,
        data: blob,
        options: { contentType: image.type || "image/jpeg" },
      }).result;

      // 2️⃣ Créer le produit dans la base Amplify Data
      await client.models.Product.create({
        name,
        description,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
        rate: rate ? parseFloat(rate) : undefined,
        imagePath: key,
      });

      Alert.alert("✅ Succès", "Produit ajouté avec succès !");
      setName("");
      setDescription("");
      setPrice("");
      setOldPrice("");
      setRate("");
      setImage(null);
      navigation.navigate("Gallery");
    } catch (err) {
      console.error("Erreur:", err);
      Alert.alert("Erreur", "Impossible d’ajouter le produit.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter un produit</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom du produit"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Ancien prix"
        keyboardType="numeric"
        value={oldPrice}
        onChangeText={setOldPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Note (ex: 4.5)"
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
      />

      <Button title="Choisir une image" onPress={pickImage} />

      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      {uploading ? (
        <ActivityIndicator style={{ marginTop: 16 }} size="large" />
      ) : (
        <Button title="➕ Ajouter le produit" onPress={handleAddProduct} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  preview: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
});
