import React, { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, View, Text, Image, Pressable, ScrollView, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { editUser, getUserProfile } from "../../services/clientService"
import InputTransparent from "../../components/InputTransparent"
import * as ImagePicker from "expo-image-picker"
import { TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { FontAwesome, Ionicons } from "@expo/vector-icons"

const ProfileScreen = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  })
  const [token, setToken] = useState(null)
  const [userOn, setUserOn] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [image, setImage] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

        if (!token) {
          navigation.navigate("LoginScreen")
        }

        const user = await getUserProfile(token)
        setUserOn(user)

        console.log(JSON.stringify(user, null, 2))
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    checkToken()
  }, [token, navigation])

  const handleEdit = () => {
    setForm({
      name: "",
      email: "",
      address: "",
    })
    setIsEditing(true)
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken")

      router.replace("/LoginScreen")
      Alert.alert("Você foi desconectado com sucesso.")
    } catch (error) {
      console.error("Erro ao realizar logout:", error)
      Alert.alert("Erro", "Não foi possível realizar o logout.")
    }
  }

  const handleCancel = () => {
    setForm({
      name: userOn.name,
      email: userOn.email,
      address: userOn.address,
    })
    setIsEditing(false)
    setImage(null)
  }

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      base64: false,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  const onSubmit = async () => {
    try {
      const formData = new FormData()

      // Adiciona os dados do serviço ao formData
      formData.append("name", form.name)
      formData.append("email", form.email)
      formData.append("address", form.address)

      // Adiciona as imagens ao formData
      if (image) {
        formData.append("image", {
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          name: image.fileName || "profile.jpg",
        })
      }

      const response = await editUser(formData, userOn._id, token)
      console.log(response)

      if (!response.status) {
        alert(response.message)
        const updatedUser = await getUserProfile(token)
        setUserOn(updatedUser)
        setIsEditing(false)
        router.replace("ProfileScreen")
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar as informações.")
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
        <Ionicons name="exit-outline" size={32} color="black" />
        <Text
          style={{
            fontSize: 18,
          }}
        >
          Sair
        </Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={isEditing ? pickImage : null}
        >
          <Image
            source={{
              uri: image && image.uri ? image.uri : userOn.image || undefined,
            }}
            style={styles.profileImage}
          />

          {isEditing && (
            <View style={styles.iconOverlay}>
              <FontAwesome name="pencil" size={24} color="rgba(0, 0, 0, 0.6)" />
            </View>
          )}
        </TouchableOpacity>

        {isEditing ? (
          <InputTransparent
            placeholder={userOn.name}
            onChange={handleInputChange}
            name="name"
            value={form.name}
            style={styles.name}
          />
        ) : userOn.name ? (
          <Text style={styles.name}>{userOn.name}</Text>
        ) : (
          <Text style={styles.name}>Carregando nome</Text>
        )}

        {isEditing ? (
          <InputTransparent
            placeholder={userOn.email}
            onChange={handleInputChange}
            name="email"
            value={form.email}
            style={styles.email}
          />
        ) : userOn.email ? (
          <Text style={styles.email}>{userOn.email}</Text>
        ) : (
          <Text style={styles.email}>Carregando email</Text>
        )}

        {isEditing ? (
          <InputTransparent
            placeholder="Altere a localização"
            onChange={handleInputChange}
            name="address"
            value={form.address}
            style={styles.location}
          />
        ) : userOn.address ? (
          <Text style={styles.location}>{userOn.address["address"]}</Text>
        ) : (
          <Text style={styles.location}>Carregando localização</Text>
        )}

        {isEditing ? (
          <>
            <TouchableOpacity style={styles.editButton} onPress={onSubmit}>
              <Text style={styles.editButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleCancel}>
              <Text style={styles.editButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Editar</Text>
          </Pressable>
        )}

        {/* About Section */}
        <Text style={styles.sectionTitle}>Sobre mim</Text>
        <View style={styles.aboutContainer}>
          {/* <View style={styles.aboutItem}>
            <Text style={styles.aboutItemTitle}>Meu serviço</Text>
            
          </View> */}
          <View style={styles.aboutItem}>
            <Text style={styles.aboutItemTitle}>Serviços Favoritos (IMPLEMENTAR)</Text>
            <Text style={styles.aboutItemSubtitle}>500+ connections</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },
  imageContainer: {
    alignSelf: "center",
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignSelf: "center",
    marginBottom: 16,
  },
  iconOverlay: {
    position: "absolute",
    bottom: 14,
    right: 0,
    borderRadius: 15,
    padding: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    paddingTop: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  location: {
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 16,
    color: "gray",
    textAlign: "center",
  },
  jobTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  aboutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  aboutItem: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  aboutItemTitle: {
    fontWeight: "bold",
  },
  aboutItemSubtitle: {
    color: "gray",
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceItem: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  serviceDescription: {
    fontWeight: "bold",
  },
  serviceNote: {
    color: "gray",
    marginBottom: 5,
  },
  serviceButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  serviceButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default ProfileScreen
