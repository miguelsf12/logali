import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from "react-native"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUserProfile, sendActualLocation } from "../../services/clientService"
import { getServicesFiltered } from "../../services/serviceService"
import Slider from "@react-native-community/slider"
import { router } from "expo-router"
import { debounce } from "lodash"
import ReactContentLoader, { Rect } from "react-content-loader/native"
import categories from "../../category.json"
import * as Location from "expo-location"

export default function HomeScreen() {
  const navigation = useNavigation()
  const [token, setToken] = useState(null)
  const [userOn, setUserOn] = useState({})
  const [radius, setRadius] = useState(5)
  const [servicesAround, setServicesAround] = useState(null)
  const [loading, setLoading] = useState(false)
  const [locationActual, setLocationActual] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(true)

  // Resgatar token
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

        const response = await getUserProfile(token)

        setUserOn(response)
        if (!token) {
          navigation.navigate("LoginScreen")
        }
      } catch (error) {
        console.error(error)
      }
    }

    checkToken()
  }, [])

  // Permissão de Localização e resgate

  useEffect(() => {
    const fetchLocationInitial = async () => {
      try {
        // Solicitar permissões para acessar a localização
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Este aplicativo precisa da sua localização para funcionar corretamente.",
            [{ text: "OK", onPress: () => console.log("Permissão negada") }]
          )
          return
        }

        // Obter a localização atual
        let currentLocation = await Location.getCurrentPositionAsync({})
        const { latitude, longitude } = currentLocation.coords
        const coords = [latitude, longitude]
        const address = `${coords[0]}, ${coords[1]}`

        // Enviar para o Redis e armazenar no AsyncStorage
        const response = await sendActualLocation({ address })

        // Sucesso: armazena no AsyncStorage prop status so vem no erro
        if (!response.status) {
          await AsyncStorage.setItem("actualLocation", JSON.stringify(response))
          setLocationActual(response) // Atualiza o estado da localização
          setLoadingLocation(false)
        } else {
          console.error("Erro ao enviar a localização para o Redis:", response)
        }
      } catch (error) {
        console.error("Erro ao buscar localização:", error)
      }
    }

    fetchLocationInitial()
  }, [])

  // Resgate de serviços próximos
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

  // Buscar loc do AsyncStorage (Talvez não será mais necessário)
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

        const storedLocation = await AsyncStorage.getItem("actualLocation")
        if (storedLocation) {
          const locationData = JSON.parse(storedLocation)
          setLocationActual(locationData)
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

  const toAddService = () => {
    router.push("AddServiceScreen")
  }

  const toMyService = () => {
    router.push("OwnerServiceScreen")
  }

  const toService = (serviceId) => {
    router.push(`/service/${serviceId}`)
  }

  return (
    <>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"} />
      <ScrollView
        style={{ backgroundColor: "#F9FAFA" }}
        showsVerticalScrollIndicator={false}
      >
        {/* <Image source={homeImage} style={styles.heroImage} /> */}
        <View style={styles.container}>
          <View style={styles.heroSection}>
            {loadingLocation ? (
              <Text style={styles.title}>Carregando localização</Text>
            ) : (
              <Text style={styles.locAtual} ellipsizeMode="tail" numberOfLines={2}>
                {locationActual.address}
              </Text>
            )}

            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>
                Encontre a solução mais próxima de você
              </Text>
              <Text style={styles.heroSubtitle}>
                Resolva seu problema de maneira rápida com os serviços mais próximos
              </Text>
            </View>
            <View style={styles.getStarted}>
              <Pressable
                style={styles.getStartedButton}
                onPress={() => router.push("SearchScreen")}
              >
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

          <View style={styles.containerService}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.filterOption}
                    onPress={() =>
                      router.push(`/SearchByCategory?category=${category.name}`)
                    }
                  >
                    <Text style={styles.filterOptionText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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
                minimumTrackTintColor="#00AAFF"
                maximumTrackTintColor="#007AAA"
                thumbTintColor="#FFFFFF"
              />
            </View>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {loading ? (
                <ReactContentLoader
                  width={150}
                  speed={2}
                  primaryColor="#7d7d7d"
                  secondaryColor="#7d7d7d"
                >
                  <Rect x="20" y="10" width="100%" height="130" />
                </ReactContentLoader>
              ) : servicesAround === null ? (
                <Text style={styles.noServicesText}>Nenhum serviço próximo</Text>
              ) : (
                servicesAround.map((service) => (
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
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 340,
    width: "100vw",
  },
  heroText: {
    marginBottom: 16,
  },
  heroTitle: {
    color: "#000",
    fontSize: 32,
    fontWeight: "bold",
  },
  heroSubtitle: {
    color: "#000",
    fontSize: 14,
  },
  locAtual: {
    textAlign: "center",
    alignSelf: "center",
    color: "#000",
    fontSize: 16,
    fontWeight: 700,
    width: 140,
    marginBottom: 20,
  },
  getStarted: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  getStartedButton: {
    width: "45%",
    backgroundColor: "#007AAA",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    textAlign: "center",
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
  filtersOptions: {
    marginTop: 13,
    flexDirection: "row",
    gap: 10,
  },
  filterOption: {
    backgroundColor: "#E8E8E8",
    fontSize: 12,
    padding: 8,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterOptionText: {
    fontSize: 12,
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
