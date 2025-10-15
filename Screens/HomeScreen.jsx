import React, { useState } from "react";
import {
  View,
  Dimensions,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";


const { width } = Dimensions.get("window");

const images = [
  "https://picsum.photos/id/1011/600/400",
  "https://picsum.photos/id/1012/600/400",
  "https://picsum.photos/id/1013/600/400",
];

const logo = "https://www.qatarstalk.com/wp-content/uploads/2024/06/23Stop-n-Shop-Hypermarket-1024x512.webp";
const avatar = "https://tse2.mm.bing.net/th/id/OIP.E2lwe-_bLJWe3ohKGzh6sAHaHa?pid=Api&P=0&h=220";

const categories = ["food products", "clothes", "electronics & mobiles", "home & living", "others"];

const subCategories = {
  "food products": [
    {
      name: "Fruits",
      image: "https://tse4.mm.bing.net/th/id/OIP.LiYTJAVrXkT-m41dYyNmWQHaHP?pid=Api&P=0&h=220",
    },

    {
      name: "Eggs",
      image: "https://cdn-icons-png.flaticon.com/512/135/135620.png",
    },


    {
      name: "Fresh Chicken",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Dental Care",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Fresh Milk",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Fresh Chicken",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Chocolates",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Baby Products",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Skin Care",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Biscuits",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Beverages",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Pets Essentials",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Seafood",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Beaf & Veal",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },
        {
      name: "Ice Creams",
      image: "https://cdn-icons-png.flaticon.com/512/590/590701.png",
    },

  ],
  clothes: [
    {
      name: "Homme",
      image: "https://cdn-icons-png.flaticon.com/512/947/947271.png",
    },
    {
      name: "Femme",
      image: "https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
    },
    {
      name: "Enfants",
      image: "https://cdn-icons-png.flaticon.com/512/2570/2570474.png",
    },
  ],
  "electronics & mobiles": [
    {
      name: "Smartphones",
      image: "https://cdn-icons-png.flaticon.com/512/994/994928.png",
    },
    {
      name: "Ordinateurs",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    },
    {
      name: "Accessoires",
      image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    },
  ],
  "home & living": [
    {
      name: "Cooking & Dining",
      image: "https://cdn-icons-png.flaticon.com/512/3715/3715383.png",
    },
    {
      name: "Luggage",
      image: "https://cdn-icons-png.flaticon.com/512/1166/1166470.png",
    },
    {
      name: "Toys",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081605.png",
    },
        {
      name: "Home & Decor",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081605.png",
    },
        {
      name: "SunGlasses",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081605.png",
    },
        {
      name: "Major Appliances",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081605.png",
    },
  ],
  others: [
    {
      name: "Livres",
      image: "https://cdn-icons-png.flaticon.com/512/3665/3665923.png",
    },
    {
      name: "Jouets",
      image: "https://cdn-icons-png.flaticon.com/512/809/809957.png",
    },
    {
      name: "Sport",
      image: "https://cdn-icons-png.flaticon.com/512/2165/2165465.png",
    },
  ],
};

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("food products");

  const filteredSubCategories = subCategories[selectedCategory]?.filter((sub) =>
  sub.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.headercontainer}>
        <Pressable onPress={()=>Alert.alert("clicked")}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </Pressable>
        
        <Text style={styles.headertext}>Stop & Shop</Text>
        <Image source={{ uri: logo }} style={styles.logo} />
      </View>

      {/* Search */}
      <TextInput
        style={styles.textinput}
        placeholder="Recherche..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Carousel */}
      <Carousel
        width={width}
        height={150}
        data={images}
        autoPlay
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
      />

      {/* Catégories horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categorycontainer}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categorybutton,
              selectedCategory === category && styles.categorybuttonactive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categorytext,
                selectedCategory === category && styles.categorytextactive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sous-catégories en grille */}
      <View style={styles.subcategoryGrid}>
{filteredSubCategories?.length > 0 ? (
  filteredSubCategories.slice(0, 19).map((sub, index) => (
    <TouchableOpacity
      key={`${sub.name}-${index}`}
      style={styles.subcategoryBox}
      onPress={() =>
        navigation.navigate("Products", {
          subCategory: sub.name,
          category: selectedCategory,
          searchQuery
        
        })
      }
    >
      <Image source={{ uri: sub.image }} style={styles.subcategoryImage} />
      <Text style={styles.subcategoryName}>{sub.name}</Text>
    </TouchableOpacity>
  ))
) : (
  <Text style={{ textAlign: 'center', marginTop: 20 }}>
    Aucun résultat trouvé pour "{searchQuery}".
  </Text>
)}

      </View>
    </ScrollView>
  );
}

// Styles (inchangés, juste rangés)
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
     paddingBottom: 50,
  },
  image: {
    width: "90%",
    height: "100%",
    borderRadius: 10,
    alignSelf: "center",
  },
  headertext: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headercontainer: {
    
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation:5
  },
  textinput: {
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 10,
  },
  categorycontainer: {
    marginTop: 10,
  },
  categorybutton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  categorybuttonactive: {
    backgroundColor: "#007bff",
  },
  categorytext: {
    color: "#333",
    fontSize: 14,
  },
  categorytextactive: {
    color: "#fff",
    fontWeight: "bold",
  },
  subcategoricontainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectiontitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  subcategorilist: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subcategorybutton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  subcategorybuttonactive: {
    backgroundColor: "#28a745",
  },
  subcategorytext: {
    color: "#333",
  },
  subcategorytextactive: {
    color: "#fff",
    fontWeight: "bold",
  },
  productscontainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  productitem: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
    subcategoryVerticalList: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  subcategorycard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  subcategoryname: {
    fontSize: 16,
    fontWeight: "500",
  },
subcategoryGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 10,
  marginTop: 20,
},

subcategoryBox: {
  width: "33.33333%", // 2 par ligne avec un petit espace
  backgroundColor: "#e9f3f7ff",
  borderRadius: 10,
  padding: 10,
  marginBottom: 10,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ddd",
  elevation: 2,
},

subcategoryImage: {
  width: 90,
  height: 90,
  marginBottom: 8,
  resizeMode:"contain",

},

subcategoryName: {
  fontSize: 14,
  fontWeight: "500",
  textAlign: "center",
},

});
