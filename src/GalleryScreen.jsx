// screens/GalleryScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../amplify/data/resource";
import { useFocusEffect } from "@react-navigation/native";

const client = generateClient();

export default function GalleryScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await client.models.Product.list();
      const productsWithUrls = await Promise.all(
        data.map(async (item) => {
          const url = await getUrl({ path: item.imagePath });
          return { ...item, imageUrl: url.url };
        })
      );
      setProducts(productsWithUrls);
    } catch (error) {
      console.error("Erreur récupération produits :", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchProducts(); }, []));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🖼️ Galerie de produits</Text>

      {loading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : products.length === 0 ? (
        <Text>Aucun produit publié pour le moment.</Text>
      ) : (
        <View style={styles.grid}>
          {products.map((prod, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <Image
                source={{ uri: prod.imageUrl }}
                style={styles.image}
                onError={(e) => console.warn("Erreur image :", e.nativeEvent.error)}
              />
              <Text style={styles.name}>{prod.name}</Text>
              <Text style={styles.price}>{prod.price.toFixed(2)} QAR</Text>
              <Text style={styles.rating}>⭐ {prod.rating ?? 0}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" },
  card: {
    width: 160,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    backgroundColor: "#fafafa",
  },
  image: { width: 130, height: 130, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  price: { color: "green", fontSize: 14 },
  rating: { color: "orange", fontSize: 12 },
});
