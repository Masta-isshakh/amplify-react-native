  
    const [image, setImage] = useState(null);
    
  
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




  

  const [loadingList, setLoadingList] = useState(false);
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