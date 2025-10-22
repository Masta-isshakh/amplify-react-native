// screens/GalleryScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { list, getUrl } from "aws-amplify/storage";

export default function GalleryScreen({ navigation }) {
  const [imagesList, setImagesList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchImages = async () => {
    try {
      setLoadingList(true);

      const listed = await list({
        path: "public/images/",
        options: { listAll: true },
      });

      const urls = await Promise.all(
        listed.items.map(async (item) => {
          const urlResult = await getUrl({ path: item.path });
          return urlResult.url;
        })
      );

      setImagesList(urls);
    } catch (error) {
      console.error("Erreur récupération images :", error);
      Alert.alert("Impossible de charger les images.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          🖼️ Galerie publique
        </Text>

        <Button title="📤 Publier une image" onPress={() => navigation.navigate("Upload")} />
        <View style={{ height: 20 }} />

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
            {imagesList.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{
                  width: 150,
                  height: 150,
                  marginBottom: 15,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
