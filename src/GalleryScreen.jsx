// screens/GalleryScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { list, getUrl } from "aws-amplify/storage";

import { useFocusEffect } from "@react-navigation/native";

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
        const result = await getUrl({ path: item.path });

        // ✅ Certains SDK renvoient result.url (string) et d'autres result.url.href
        const finalUrl =
          typeof result.url === "string"
            ? result.url
            : result.url?.href || null;

        console.log("✅ Image URL:", finalUrl);

        return finalUrl;
      })
    );

    // ⚙️ Filtrer les valeurs nulles pour éviter les "Invalid"
    console.log("🧩 URLs récupérées :", urls);

    setImagesList(urls.filter(Boolean));
  } catch (error) {
    console.error("Erreur récupération images :", error);
    Alert.alert("Impossible de charger les images.");
  } finally {
    setLoadingList(false);
  }
};




  // Rafraîchit chaque fois que cet écran reçoit le focus (retour depuis Upload par ex.)
  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [])
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginTop: 24, alignItems: "center", paddingHorizontal: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          🖼️ Galerie publique
        </Text>

        <Button title="📤 Publier une image" onPress={() => navigation.navigate("Upload")} />
        <View style={{ height: 18 }} />

        {loadingList ? (
          <ActivityIndicator size="large" />
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
              // sécurité : vérifie que uri est bien une string
              if (typeof uri !== "string" || uri.length === 0) {
                return (
                  <View
                    key={`invalid-${index}`}
                    style={{ width: 150, height: 150, margin: 8, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }}
                  >
                    <Text>Invalid</Text>
                  </View>
                );
              }

              return (
                <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => {}}>
                  <Image
                    source={{ uri }}
                    style={{
                      width: 150,
                      height: 150,
                      margin: 8,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#ddd",
                    }}
                    onError={(e) => console.warn("Image load error:", e.nativeEvent)}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
