// screens/GalleryScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { list, getUrl } from "aws-amplify/storage";
import { useFocusEffect } from "@react-navigation/native";

export default function GalleryScreen({ navigation }) {
  const [imagesList, setImagesList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // 🔄 Récupérer les images depuis S3
  const fetchImages = async () => {
    try {
      setLoadingList(true);
      const listed = await list({ path: "public/images/" });

      // Vérifie que tu as bien "listed.items"
      if (!listed?.items) {
        throw new Error("Aucune image trouvée dans S3");
      }

      const urls = await Promise.all(
        listed.items.map(async (item) => {
          const { url } = await getUrl({ path: item.path });
          return url;
        })
      );

      setImagesList(urls);
    } catch (error) {
      console.error("Erreur récupération images :", error);
      Alert.alert("Erreur", "Impossible de charger les images.");
    } finally {
      setLoadingList(false);
    }
  };

  // 🧭 Recharger la liste à chaque retour sur cet écran
  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [])
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginTop: 40, paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          🖼️ Galerie publique
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
            {imagesList.map((uri, index) => (
              <TouchableOpacity key={index} onPress={() => console.log(uri)}>
                <Image
                  source={{ uri }}
                  style={{
                    width: 150,
                    height: 150,
                    marginBottom: 15,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                  resizeMode="cover"
                  onError={(e) =>
                    console.warn("Erreur image :", e.nativeEvent.error)
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
