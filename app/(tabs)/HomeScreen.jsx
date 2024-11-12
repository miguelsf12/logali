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
import { getUserProfile, sendActualLocation } from "../../services/clientService"
import { getAllServices, getServicesFiltered } from "../../services/serviceService"
import Slider from "@react-native-community/slider"
import { router } from "expo-router"
import { debounce } from "lodash"
import { ActivityIndicator } from "react-native"

const popularServices = [
  { id: 1, name: "Serviço 1", image: "url_imagem_1" },
  { id: 2, name: "Serviço 2", image: "url_imagem_2" },
  { id: 3, name: "Serviço 3", image: "url_imagem_3" },
]

export default function HomeScreen() {
  const navigation = useNavigation()
  const [token, setToken] = useState(null)
  const [userOn, setUserOn] = useState({})
  // const [myService, setMyService] = useState({})
  const [radius, setRadius] = useState(5)
  const [services, setServices] = useState([])
  const [servicesAround, setServicesAround] = useState([])
  const [loading, setLoading] = useState(false)
  const [locationActual, setLocationActual] = useState(null)
  const [address, setAddress] = useState({
    address: "",
  })
  const [inputValue, setInputValue] = useState(address.address)

  useEffect(() => {
    const fetchAllService = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

        if (!token) {
          navigation.navigate("LoginScreen")
        }

        const allServices = await getAllServices(token)

        setServices(allServices)

        const user = await getUserProfile(token)
        setUserOn(user)

        console.log(JSON.stringify(user, null, 2))
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    fetchAllService()
  }, [token, navigation])

  useEffect(() => {
    const fetchServicesAround = debounce(async () => {
      setLoading(true)
      try {
        const filters = { radius }
        console.log(radius)
        const response = await getServicesFiltered(filters, token)
        console.log(response)
        setServicesAround(response)
      } catch (error) {
        console.error("Erro ao buscar serviços filtrados:", error)
      } finally {
        setLoading(false)
      }
    }, 1000)

    fetchServicesAround()

    return () => {
      fetchServicesAround.cancel()
    }
  }, [token, radius])

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

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

    const unsubscribe = navigation.addListener("focus", () => {
      // Executa fetchLocation toda vez que a aba é acessada
      fetchLocation()
    })

    return unsubscribe // Limpeza do listener ao desmontar o componente
  }, [navigation])

  useEffect(() => {
    if (locationActual && locationActual.address) {
      setInputValue(locationActual.address)
    }
  }, [locationActual, navigation])

  const handleInputChange = (name, value) => {
    setInputValue(value)
    setAddress((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const onSubmitLoc = async () => {
    try {
      const response = await sendActualLocation(address, token)
      if (!response.status) {
        setLocationActual(response)
        await AsyncStorage.setItem("actualLocation", JSON.stringify(response))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const toAddService = () => {
    router.push("AddServiceScreen")
  }

  const toMyService = () => {
    // router.push("OwnerServiceScreen")
    navigation.navigate("OwnerServiceScreen")
  }

  const toService = (serviceId) => {
    router.push(`/service/${serviceId}`)
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image source={homeImage} style={styles.heroImage} />
          <View style={styles.heroSection}>
            <Input
              placeholder="Insira sua localização"
              style={{ backgroundColor: "#EEEFF2" }}
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
              {!userOn.provider ? (
                <Pressable onPress={toAddService} style={styles.getStartedButton}>
                  <Text style={styles.getStartedTextRegister}>Cadastrar Serviço</Text>
                </Pressable>
              ) : (
                <Pressable onPress={toMyService} style={styles.getStartedButton}>
                  <Text style={styles.getStartedTextRegister}>Meu serviço</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Popular services */}
          <View style={styles.containerService}>
            <Text style={styles.title}>Serviços Populares</Text>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {services.map((service) => (
                <TouchableOpacity
                  onPress={() => toService(service._id)}
                  key={service._id}
                  style={styles.card}
                >
                  <Image
                    source={{
                      uri: `${service.images[0]}`,
                    }}
                    style={styles.image}
                  />
                  <Text style={styles.serviceName}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Serviços Proximos */}
          <View style={styles.containerService}>
            <Text style={styles.title}>Serviços Próximos</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Alterar raio</Text>
              <Text style={styles.radiusValue}>{radius} km</Text>
            </View>

            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                step={1}
                value={radius}
                onValueChange={(value) => setRadius(value)}
                minimumTrackTintColor="#019863"
                maximumTrackTintColor="#E9DFCE"
                thumbTintColor="#019863"
              />
            </View>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" /> // Exibe o loading
              ) : servicesAround.length < 1 ? (
                <Text style={styles.noServicesText}>Nenhum serviço próximo</Text>
              ) : (
                servicesAround.length != 0 &&
                servicesAround.map((service) => (
                  <TouchableOpacity
                    onPress={() => toService(service._id)} // Passa a função corretamente
                    key={service._id}
                    style={styles.card}
                  >
                    <Image
                      source={{
                        uri: `${service.images[0]}`,
                      }}
                      style={styles.image}
                    />
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
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
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  serviceName: {
    marginTop: 8,
    textAlign: "center",
  },
  headerText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C160C",
  },
  radiusValueMobile: {
    fontSize: 14,
    color: "#1C160C",
    display: "none",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  radiusValue: {
    fontSize: 16,
    color: "#1C160C",
    paddingLeft: 8,
  },
})
