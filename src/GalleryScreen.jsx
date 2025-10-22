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
import { Storage } from "aws-amplify";
import { useFocusEffect } from "@react-navigation/native";

export default function GalleryScreen({ navigation }) {
  const [imagesList, setImagesList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchImages = async () => {
    try {
      setLoadingList(true);

      // liste les fichiers dans le dossier 'images/' (niveau public)
      const listed = await Storage.list("images/", { level: "public" });

      // Storage.list retourne généralement des objets { key, eTag, size, ... }
      // Pour chaque item on récupère l'URL publique via Storage.get
      const urls = await Promise.all(
        (listed || []).map(async (item) => {
          // item.key est le chemin relatif (ex: "images/photo.jpg")
          try {
            const url = await Storage.get(item.key, { level: "public" });
            // Storage.get retourne normalement une string (url)
            return typeof url === "string" ? url : String(url);
          } catch (e) {
            console.warn("Erreur get URL pour", item.key, e);
            return null;
          }
        })
      );

      // filtre les valeurs invalides et garde uniquement les strings non vides
      const filtered = urls.filter((u) => typeof u === "string" && u.length > 0);
      setImagesList(filtered);
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
