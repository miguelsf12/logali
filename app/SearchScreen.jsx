import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import Input from "../components/Input"
import Entypo from "@expo/vector-icons/Entypo"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { debounce } from "lodash"
import { getServicesFiltered } from "../services/serviceService"
import { router } from "expo-router"

export default function SearchScreen() {
  const [token, setToken] = useState(null)
  const [filter, setFilter] = useState({})
  const [servicesFound, setServicesFound] = useState([])

  const handleInputChange = (name, value) => {
    setFilter((prevForm) => ({
      // ...prevForm,
      name: value,
      category: value,
    }))
    console.log(filter)
  }

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    checkToken()
  }, [token])

  const toService = (serviceId) => {
    router.push(`/service/${serviceId}`)
  }

  const onSubmit = async () => {
    try {
      const response = await getServicesFiltered(filter, token)
      setServicesFound(response)
      console.log(JSON.stringify(response, null, 2))
    } catch (error) {
      console.error("Erro ao buscar serviços filtrados:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="Procure o serviço que deseja"
        style={{ backgroundColor: "#E8E8E8" }}
        name="filter"
        onChange={handleInputChange}
        icon={
          <Entypo name="magnifying-glass" onPress={onSubmit} size={24} color="black" />
        }
      />

      <ScrollView vertical={true}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersOptions}>
            <TouchableOpacity style={styles.filterOption}>
              <Text>Todos os serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterOption}>
              <Text>Borracharia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterOption}>
              <Text>Limpeza</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterOption}>
              <Text>Organização de Eventos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.contentsService}>
          {servicesFound.length == 0 && (
            <Text
              style={{ color: "#a7a7a7", marginTop: 20, fontSize: 17, fontWeight: 600 }}
            >
              Experimente fazer uma busca, talvez ela te ajude!
            </Text>
          )}

          {servicesFound.map((service) => (
            <TouchableOpacity
              key={service._id}
              style={styles.cardService}
              onPress={() => toService(service._id)}
            >
              <Image
                source={{
                  uri: `${service.images[0]}`,
                }}
                style={styles.image}
              />
              <View style={styles.contentText}>
                <Text style={{ fontSize: 17, fontWeight: 600 }}>{service.name}</Text>
                <Text
                  style={{ flex: 1, marginRight: 20 }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {service.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
  },
  filtersOptions: {
    marginTop: 13,
    flexDirection: "row",
    gap: 10,
  },
  filterOption: {
    backgroundColor: "#E8E8E8",
    padding: 8,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
  },
  contentsService: {
    width: "100%",
    flexDirection: "column",
    alignSelf: "center",
  },
  cardService: {
    marginTop: 20,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  contentText: {
    paddingLeft: 14,
  },
  image: {
    width: 130,
    height: 80,
    borderRadius: 8,
  },
})
