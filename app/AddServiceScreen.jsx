import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  Switch,
  Alert,
} from "react-native"
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons"
import categories from "../category.json"
import InputOutlined from "../components/InputOutlined"
import * as ImagePicker from "expo-image-picker"
import { addservice } from "../services/providerService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"

const AddServiceScreen = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
  })
  const [images, setImages] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)

  // Função para pegar as imagens
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false,
      quality: 1,
    })

    if (!result.canceled) {
      setImages(result.assets)
    }
  }

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const handleCategorySelect = (category) => {
    setForm((prevForm) => ({
      ...prevForm,
      category: category,
    }))
    setModalVisible(false) // Fecha o modal após a seleção
  }

  const onSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken")
      const formData = new FormData()

      // Adiciona os dados do serviço ao formData
      formData.append("name", form.name)
      formData.append("description", form.description)
      formData.append("category", form.category)
      formData.append("location", form.location)

      // Adiciona as imagens ao formData
      images.forEach((image, index) => {
        formData.append(`images`, {
          uri: image.uri,
          type: image.mimeType,
          name: image.fileName,
        })
      })

      const response = await addservice(formData, token)

      if (!response.status) {
        Alert.alert("Serviço adicionado com sucesso!")
        router.replace("OwnerServiceScreen")
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Erro ao adicionar o serviço.")
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("HomeScreen")}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar serviço</Text>
        </View>
        {/* Service Name Input */}
        <InputOutlined
          placeholder="Nome do serviço"
          onChange={handleInputChange}
          name="name"
          value={form.name}
        />

        {/* Service Description Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Insira descrição do serviço"
            value={form.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
          />
        </View>

        {/* Category Input com Ícone */}
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setModalVisible(true)}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#cedbe8",
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Selecione uma categoria"
              style={{
                flex: 1,
                padding: 16,
                fontSize: 16,
                color: "#1C1D22",
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
              }}
              value={form.category}
              editable={false}
            />
            <View
              style={{
                paddingHorizontal: 16,
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
              }}
            >
              <FontAwesome name="caret-down" size={24} color="#7d7d7d" />
            </View>
          </View>
        </TouchableOpacity>
        {/* Modal de Seleção de Categoria */}
        <Modal visible={isModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => handleCategorySelect(item.name)}
                  >
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Location Input */}
        <InputOutlined
          placeholder="Endereço"
          onChange={handleInputChange}
          name="location"
          value={form.location}
          icon={<FontAwesome name="location-arrow" size={24} color="#7d7d7d" />}
        />

        {/* Add Photos Section */}

        <TouchableOpacity style={styles.addImage} onPress={pickImage}>
          <Text style={styles.sectionTitle}>
            Adicionar fotos max. 3 <AntDesign name="addfile" size={18} color="black" />
          </Text>
        </TouchableOpacity>

        <View style={styles.photosContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.photoLarge} />
          ))}
        </View>

        {/* Post Service Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onSubmit} style={styles.postButton}>
            <Text style={styles.buttonText}>Cadastrar Serviço</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFA",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d141c",
    textAlign: "center",
    flex: 1,
  },
  saveText: {
    color: "#49719c",
    fontWeight: "bold",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderColor: "#cedbe8",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0d141c",
  },
  textArea: {
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "50%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryText: {
    fontSize: 16,
    color: "#0d141c",
  },
  addImage: {
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d141c",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#0d141c",
  },
  photosContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  photoLarge: {
    flex: 2,
    aspectRatio: 3 / 2,
    marginRight: 8,
    borderRadius: 12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postButton: {
    backgroundColor: "#2589f4",
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default AddServiceScreen
