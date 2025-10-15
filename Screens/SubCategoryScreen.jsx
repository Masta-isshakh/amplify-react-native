// Screens/SubCategoryScreen.jsx
import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const subCategories = {
  "food products": [
    { name: "Fruits", image: "https://cdn-icons-png.flaticon.com/512/590/590685.png" },
    { name: "Légumes", image: "https://cdn-icons-png.flaticon.com/512/135/135620.png" },
    { name: "Produits laitiers", image: "https://cdn-icons-png.flaticon.com/512/590/590701.png" },
  ],
  clothes: [
    { name: "Homme", image: "https://cdn-icons-png.flaticon.com/512/947/947271.png" },
    { name: "Femme", image: "https://cdn-icons-png.flaticon.com/512/1055/1055646.png" },
    { name: "Enfants", image: "https://cdn-icons-png.flaticon.com/512/2570/2570474.png" },
  ],
  "electronics & mobiles": [
    { name: "Smartphones", image: "https://cdn-icons-png.flaticon.com/512/994/994928.png" },
    { name: "Ordinateurs", image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png" },
    { name: "Accessoires", image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png" },
  ],
  "home & living": [
    { name: "Meubles", image: "https://cdn-icons-png.flaticon.com/512/3715/3715383.png" },
    { name: "Déco", image: "https://cdn-icons-png.flaticon.com/512/1166/1166470.png" },
    { name: "Cuisine", image: "https://cdn-icons-png.flaticon.com/512/3081/3081605.png" },
  ],
  others: [
    { name: "Livres", image: "https://cdn-icons-png.flaticon.com/512/3665/3665923.png" },
    { name: "Jouets", image: "https://cdn-icons-png.flaticon.com/512/809/809957.png" },
    { name: "Sport", image: "https://cdn-icons-png.flaticon.com/512/2165/2165465.png" },
  ],
};

export default function SubCategoryScreen() {
  const route = useRoute();
  const { category } = route.params;

  const list = subCategories[category] || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sous-catégories : {category}</Text>
      <View style={styles.grid}>
        {list.map((item) => (
          <View key={item.name} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  name: {
    textAlign: "center",
    fontSize: 14,
  },
});
