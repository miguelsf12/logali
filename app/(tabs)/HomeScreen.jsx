import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Input from "../../components/Input"
import homeImage from "../../assets/images/home-image.jpeg"
import { FontAwesome } from "@expo/vector-icons"
import { sendActualLocation } from "../../services/clientService"

const popularServices = [
  { id: 1, name: "Serviço 1", image: "url_imagem_1" },
  { id: 2, name: "Serviço 2", image: "url_imagem_2" },
  { id: 3, name: "Serviço 3", image: "url_imagem_3" },
]

export default function HomeScreen() {
  const navigation = useNavigation()
  const [token, setToken] = useState(null)
  const [location, setLocation] = useState({})
  const [locationActual, setLocationActual] = useState(null)
  const [address, setAddress] = useState({
    address: "",
  })
  const [inputValue, setInputValue] = useState(address.address)

  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem("authToken")
    setToken(storedToken)
  }

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        navigation.navigate("LoginScreen")
      }
    }

    if (token !== null) {
      checkToken()
    }
  }, [token, navigation])

  useEffect(() => {
    if (location && location.address) {
      setInputValue(location.address)
    }
  }, [location])

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem("actualLocation")
        if (storedLocation) {
          const locationData = JSON.parse(storedLocation)
          setLocationActual(locationData)
          setInputValue(locationData.address)
        }
      } catch (error) {
        console.error("Erro ao buscar localização:", error)
      }
    }

    fetchLocation()
  }, [locationActual])

  const handleInputChange = (name, value) => {
    setInputValue(value)
    setAddress((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const onSubmitLoc = async () => {
    try {
      const response = await sendActualLocation(address)
      if (!response.status) {
        setLocation(response)
        await AsyncStorage.setItem("actualLocation", JSON.stringify(response))
      }
    } catch (error) {
      console.error(error)
    }
    console.log(location)
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image source={homeImage} style={styles.heroImage} />
          <View style={styles.heroSection}>
            <Input
              name="address"
              onChange={handleInputChange}
              value={inputValue}
              icon={
                <FontAwesome
                  onPress={onSubmitLoc}
                  name="location-arrow"
                  size={24}
                  color="#7d7d7d"
                />
              }
            />

            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>
                Encontre a solução mais próxima de você
              </Text>
              <Text style={styles.heroSubtitle}>
                Resolva seu problema de maneira rápida com os serviços mais próximos
              </Text>
            </View>
            <View style={styles.getStarted}>
              <Pressable style={styles.getStartedButton}>
                <Text style={styles.getStartedTextFind}>Procurar</Text>
              </Pressable>
              <Pressable style={styles.getStartedButton}>
                <Text style={styles.getStartedTextRegister}>Cadastrar Serviço</Text>
              </Pressable>
            </View>
          </View>

          {/* Popular services */}
          {/* <View style={styles.containerService}>
            <Text style={styles.title}>Serviços Populares</Text>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {popularServices.map((service) => (
                <View key={service.id} style={styles.card}>
                  <Image source={{ uri: service.image }} style={styles.image} />
                  <Text style={styles.serviceName}>{service.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View> */}
        </View>
      </ScrollView>
      {/* <Navigation /> */}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFA",
  },
  heroSection: {
    position: "relative",
    minHeight: 300,
    justifyContent: "flex-end",
    padding: 16,
    marginTop: 20,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    height: 320,
    width: "100vw",
  },
  heroText: {
    marginBottom: 16,
  },
  heroTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  heroSubtitle: {
    color: "white",
    fontSize: 14,
  },
  getStarted: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  getStartedButton: {
    width: "45%",
    backgroundColor: "#607AFB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  getStartedTextFind: {
    color: "#F9FAFA",
    fontWeight: "bold",
  },
  getStartedTextRegister: {
    color: "#F9FAFA",
    fontWeight: "bold",
  },
  containerService: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    width: 150,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    elevation: 2, // Adiciona uma leve sombra
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  serviceName: {
    marginTop: 8,
    textAlign: "center",
  },
})
