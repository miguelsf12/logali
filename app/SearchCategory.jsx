import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getServicesFiltered } from "../services/serviceService"
import { router, useLocalSearchParams } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"

export default function SearchCategory() {
  const { category } = useLocalSearchParams()
  const [token, setToken] = useState(null)
  const [servicesFound, setServicesFound] = useState([])

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
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const filter = { category }

        const response = await getServicesFiltered(filter, token)
        console.log(response)
        setServicesFound(response)
      } catch (error) {
        console.error("Erro ao buscar categoria:", error)
      }
    }

    fetchServices()
  }, [token, category])

  const toService = (serviceId) => {
    router.push(`/service/${serviceId}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ textAlign: "center" }}>{category}</Text>
      </View>

      <ScrollView vertical={true}>
        <View style={styles.contentsService}>
          {servicesFound.length === 0 && (
            <Text
              style={{ color: "#a7a7a7", marginTop: 20, fontSize: 17, fontWeight: "600" }}
            >
              Nenhum serviço dessa categoria foi encontrado
            </Text>
          )}

          {Array.isArray(servicesFound) &&
            servicesFound.length > 0 &&
            servicesFound.map((service) => (
              <TouchableOpacity
                key={service._id}
                style={styles.cardService}
                onPress={() => toService(service._id)}
              >
                <Image
                  source={{
                    uri: service.images?.[0] || "default-image-url", // Handle missing images
                  }}
                  style={styles.image}
                />
                <View style={styles.contentText}>
                  <Text style={{ fontSize: 17, fontWeight: "600" }}>{service.name}</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
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
    paddingBottom: 10,
  },
  image: {
    width: 130,
    height: 80,
    borderRadius: 8,
  },
})
