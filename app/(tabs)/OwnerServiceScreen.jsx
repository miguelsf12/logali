import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
  Switch,
  Platform,
  Linking,
  Pressable,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getMyService } from "../../services/serviceService"
import { getUserProfile } from "../../services/clientService"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import InputOutlined from "../../components/InputOutlined"
import { editservice } from "../../services/providerService"
import { FontAwesome } from "@expo/vector-icons"
import categories from "../../category.json"
import Service404 from "../Service404"

export default function OwnerServiceScreen() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
  })
  const [token, setToken] = useState(null)
  const [userOn, setUserOn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState(null)
  const navigation = useNavigation()
  const [isModalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [images, setImages] = useState([])

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

        if (!token) {
          navigation.navigate("LoginScreen")
          return
        }

        const user = await getUserProfile(token)
        setUserOn(user)

        const myService = await getMyService(token)

        setService(myService)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      } finally {
        setLoading(false)
      }
    }

    checkToken()
  }, [token, navigation, service])

  if (loading) {
    return <Text>Carregando...</Text> // Pode adicionar um spinner aqui, se quiser
  }

  if (!service) {
    return <Service404 />
  }

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

  const onSubmit = async () => {
    try {
      const formData = new FormData()

      // Adiciona os dados do serviço ao formData
      formData.append("name", form.name)
      formData.append("description", form.description)
      formData.append("category", form.category)
      formData.append("location", form.location)

      // Adiciona as imagens ao formData
      images.forEach((image, index) => {
        console.log("Image URI: ", image.uri)
        formData.append(`images`, {
          uri: image.uri,
          type: image.mimeType,
          name: image.fileName,
        })
      })

      const response = await editservice(formData, service._id, token)
      console.log(response)

      if (!response.status) {
        alert(response.message)
        setIsEditing(false)
        router.replace("OwnerServiceScreen")
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar o serviço.")
    }
  }

  const handleCategorySelect = (category) => {
    setForm((prevForm) => ({
      ...prevForm,
      category: category,
    }))
    setModalVisible(false) // Fecha o modal após a seleção
  }

  const handleEdit = () => {
    // Limpe o estado do formulário ao entrar no modo de edição
    setForm({
      name: "",
      description: "",
      category: "",
      location: "",
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setForm({
      name: service.name,
      description: service.description,
      category: service.category,
      location: service.location.address,
    })
    setIsEditing(false) // Desativa o modo de edição
    setImages([]) // Exclui as imagens
  }

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const openMap = (latitude, longitude, address) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${latitude},${longitude}(${address})`,
    })

    Linking.openURL(url)
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title and Description */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {isEditing ? (
              <>
                <TouchableOpacity onPress={onSubmit}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleEdit}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!isEditing ? (
          <Text style={styles.title}>{service.name}</Text>
        ) : (
          <InputOutlined
            placeholder="Nome do serviço"
            onChange={handleInputChange}
            name="name"
            value={form.name}
          />
        )}

        {!isEditing ? (
          <Text style={styles.description}>{service.description}</Text>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Insira descrição do serviço"
              value={form.description}
              onChangeText={(text) => handleInputChange("description", text)}
              multiline
            />
          </View>
        )}

        {/* Images Grid */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollContainer}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.image} />
              </View>
            ))
          ) : service && service.images && service.images.length > 0 ? (
            service.images.map((imagePath, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: `http://192.168.1.4:3000/public/service/images/${imagePath}`,
                  }}
                  style={styles.image}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noImagesText}>No images available</Text>
          )}
        </ScrollView>

        {/* Location */}
        {!isEditing ? (
          <View style={styles.detail}>
            <Text style={styles.detailTitle}>Localização</Text>
            <TouchableOpacity
              onPress={() =>
                openMap(
                  service.location.coordinates[0],
                  service.location.coordinates[1],
                  service.location.address
                )
              }
            >
              <Text style={styles.detailValue}>
                {service.location.address}
                {"    "}
                <FontAwesome name="location-arrow" size={24} color="#7d7d7d" />
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <InputOutlined
              placeholder="Endereço"
              onChange={handleInputChange}
              name="location"
              value={form.location}
            />
          </>
        )}

        {/* Category */}
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Categoria</Text>
          <Text style={styles.detailValue}>{service.category}</Text>
        </View>

        {/* Category Input with Icon */}
        {isEditing && (
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
        )}

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

        {/* Provider */}
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Provedor</Text>
          <Text style={styles.detailValue}>{service.provider.name}</Text>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
              <Text style={styles.primaryButtonText}>Add/Trocar Imagens</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Promotion Button */}
        <View style={styles.promotionButton}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Promover meu serviço</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "#f1f5f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d141c",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  saveText: {
    color: "#49719c",
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  cancelText: {
    color: "#49719c",
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  editText: {
    color: "#49719c",
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: "#0d141c",
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryText: {
    fontSize: 16,
    color: "#0d141c",
  },
  imageScrollContainer: {
    paddingHorizontal: 16,
  },
  imageWrapper: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1.5,
    height: 200,
    borderRadius: 8,
  },
  noImagesText: {
    color: "#0d141c",
    fontSize: 16,
    paddingHorizontal: 16,
  },
  detail: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d141c",
  },
  detailValue: {
    fontSize: 14,
    color: "#49719c",
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  primaryButton: {
    backgroundColor: "#2589f4",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#e7edf4",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#0d141c",
    fontSize: 16,
    fontWeight: "bold",
  },
  promotionButton: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  getStartedButton: {
    width: "45%",
    backgroundColor: "#607AFB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  getStartedTextRegister: {
    color: "#F9FAFA",
    fontWeight: "bold",
  },
})
