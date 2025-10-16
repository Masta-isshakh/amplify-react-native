import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoList from "../src/TodoList";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const images = [
  "https://picsum.photos/id/1011/600/400",
  "https://picsum.photos/id/1012/600/400",
  "https://picsum.photos/id/1013/600/400",
];

const logo =
  "https://www.qatarstalk.com/wp-content/uploads/2024/06/23Stop-n-Shop-Hypermarket-1024x512.webp";
const avatar =
  "https://tse2.mm.bing.net/th/id/OIP.E2lwe-_bLJWe3ohKGzh6sAHaHa?pid=Api&P=0&h=220";

const categories = [
  "food products",
  "clothes",
  "electronics & mobiles",
  "home & living",
  "others",
];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("food products");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headercontainer}>
        <TouchableOpacity>
          <Image source={{ uri: logo }} style={styles.logo} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Stop & Shop</Text>
        <TouchableOpacity>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          <TextInput
            placeholder="search item..."
            placeholderTextColor="#a19898ff"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.textinput}
          />
        </View>

        <View>
          <Carousel
            width={width}
            height={150}
            data={images}
            autoPlay
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.imagecarousel}
                resizeMethod="cover"
              />
            )}
          />
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  headercontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textinput: {
    backgroundColor: "#e6e6e6ff",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
    elevation: 5,
    borderColor: "#7c7777ff",
    borderWidth: 1,
  },
  imagecarousel: {
    width: "95%",
    height: "100%",
    borderRadius: 5,
    marginHorizontal: 3,
    marginTop: 20,
  },
  categorycontainer:{
    marginTop:10
  },
  categorybutton:{
    paddingVertical:10,
    paddingHorizontal:10,
    backgroundColor:"#dbd6d6ff",
    marginRight:10,
    borderRadius:20,
    elevation:2
  },
  categorybuttonactive:{
    backgroundColor:"#9e9797ff"
  },
  categorytext:{
    fontSize:14,
    color:"#333"
  },
  categorytextactive:{
    color:"#000",
    fontWeight:"bold",
  }
});
