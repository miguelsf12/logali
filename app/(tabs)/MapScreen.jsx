import { StyleSheet, Text, View } from "react-native"
import Map from "../../components/Map"
import Input from "../../components/Input"
import { useEffect, useState } from "react"
import { FontAwesome } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { sendActualLocation } from "../../services/clientService"
import { useNavigation } from "@react-navigation/native"

export default function MapScreen() {
  const [inputValue, setInputValue] = useState(null)
  const [token, setToken] = useState(null)
  const [locationActual, setLocationActual] = useState({})
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

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
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
      </View>
      <Map />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
  },
  inputContainer: {
    position: "absolute", // Torna o input absoluto
    top: 50, // Ajusta a posição do input
    left: 10,
    right: 10,
    zIndex: 1, // Garante que o input esteja acima do mapa
  },
})
