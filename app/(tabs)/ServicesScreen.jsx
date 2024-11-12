import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Map from "../../components/Map"
import Input from "../../components/Input"
import { useEffect, useState } from "react"
import { FontAwesome } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { sendActualLocation } from "../../services/clientService"
import { useNavigation } from "@react-navigation/native"
import Slider from "@react-native-community/slider"
import { debounce } from "lodash"
import { getServicesFiltered } from "../../services/serviceService"
import { router } from "expo-router"

export default function MapScreen() {
  const [inputValue, setInputValue] = useState(null)
  const [token, setToken] = useState(null)
  const [locationActual, setLocationActual] = useState({})
  const [servicesAround, setServicesAround] = useState([])
  const [radius, setRadius] = useState(5)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const [address, setAddress] = useState({
    address: "",
  })

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

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const fetchServicesAround = debounce(async () => {
      setLoading(true)
      try {
        const filters = { radius }
        const response = await getServicesFiltered(filters, token)
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
        console.log(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const toService = (serviceId) => {
    router.push(`/service/${serviceId}`)
  }

  return (
    <View style={styles.container}>
      <Map style={styles.map} />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Insira sua localização"
          style={styles.inputLoc}
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
      </View>

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
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  map: {
    height: 230,
    width: "90%",
  },
  inputContainer: {
    marginTop: 10,
    width: "100%",
  },
  inputLoc: {
    backgroundColor: "#F5EFE8",
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
    width: "100%",
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
