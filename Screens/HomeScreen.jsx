import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadData, list, getUrl } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagesList, setImagesList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // 📦 Fonction pour choisir une image dans la galerie
  const handleChooseImage = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          Alert.alert("Aucune image sélectionnée");
        } else if (response.errorCode) {
          Alert.alert("Erreur :", response.errorMessage);
        } else {
          const selectedImage = response.assets[0];
          setImage(selectedImage);
          console.log("Image sélectionnée :", selectedImage);
        }
      }
    );
  };

  // ☁️ Fonction pour uploader sur AWS Amplify Storage
  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Veuillez choisir une image avant d’uploader.");
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // 👇 Upload dans le dossier public/images/
      const result = await uploadData({
        path: `public/images/${image.fileName}`,
        data: blob,
      }).result;

      Alert.alert("Image uploadée avec succès !");
      console.log("Résultat upload :", result);

      // Recharge la liste après upload
      await fetchImages();
    } catch (error) {
      console.error("Erreur upload :", error);
      Alert.alert("Erreur lors de l’upload.");
    } finally {
      setUploading(false);
    }
  };

  // 📥 Fonction pour lister toutes les images publiques
  const fetchImages = async () => {
    try {
      setLoadingList(true);
      // Récupère la liste des fichiers dans public/images/
      const listed = await list({
        path: "public/images/",
        options: { listAll: true },
      });

      // Génère les URLs publiques pour affichage
      const urls = await Promise.all(
        listed.items.map(async (item) => {
          const urlResult = await getUrl({ path: item.path });
          console.log("URL S3 :", urlResult);
          return urlResult.url; // assure-toi de bien retourner .url
        })
      );

      setImagesList(urls);
      console.log("Images récupérées :", urls);
    } catch (error) {
      console.error("Erreur récupération images :", error);
      Alert.alert("Impossible de charger les images.");
    } finally {
      setLoadingList(false);
    }
  };

  // 🔁 Charger la liste au démarrage
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginTop: 60, alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          📸 Galerie publique
        </Text>
        <Button title="Choisir une image" onPress={handleChooseImage} />
        <View style={{ height: 15 }} />
        <Button
          title="Uploader sur AWS"
          onPress={handleUpload}
          disabled={uploading}
        />
        <View style={{ marginTop: 15 }}>
          {uploading && <ActivityIndicator size="large" color="blue" />}
          {image && (
            <Image
              source={{ uri: image?.uri }}
              style={{
                width: 200,
                height: 200,
                marginTop: 15,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            />
          )}
        </View>

        <View style={{ marginTop: 40, width: "100%", paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
            🖼️ Images publiées :
          </Text>
          {loadingList ? (
            <ActivityIndicator size="large" color="gray" />
          ) : imagesList.length === 0 ? (
            <Text>Aucune image publiée pour le moment.</Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              {imagesList.map((uri, index) => {
                // Assure-toi que c’est bien une chaîne
                const imageUri =
                  typeof uri === "string" ? uri : uri?.toString();

                return (
                  <Image
                    key={index}
                    source={{ uri: imageUri }}
                    style={{
                      width: 150,
                      height: 150,
                      marginBottom: 15,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#ddd",
                    }}
                    onError={(e) =>
                      console.warn("Erreur image :", e.nativeEvent.error)
                    }
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
