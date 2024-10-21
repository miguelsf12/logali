import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  Linking,
  Modal, // Importando Modal
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getRoutesToService, getServiceById } from "../../services/serviceService"
import Map from "../../components/Map"

const ServiceDetailScreen = () => {
  const { serviceId } = useLocalSearchParams()
  const [service, setService] = useState(null)
  const [token, setToken] = useState(null)
  const [routePoints, setRoutePoints] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false) // Estado para controlar a visibilidade do modal

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

        const response = await getServiceById(serviceId, token)
        setService(response)

        const routes = await getRoutesToService(serviceId, token)
        setRoutePoints(routes[0][0].overview_polyline.points)
      } catch (error) {
        console.error("Erro ao buscar o serviço:", error)
      }
    }

    if (serviceId) {
      fetchService()
    }
  }, [serviceId])

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Carregando serviço...</Text>
      </View>
    )
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
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollContainer}
        >
          {service &&
            service.images &&
            service.images.map((imagePath, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: `http://192.168.1.4:3000/public/service/images/${imagePath}`,
                  }}
                  style={styles.image}
                />
              </View>
            ))}
        </ScrollView>

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

        {/* Botão VER ROTA acima da Categoria */}
        <View style={styles.detail}>
          <TouchableOpacity
            style={styles.routeButton}
            onPress={() => setIsModalVisible(true)} // Abre o modal quando clicado
          >
            <Text style={styles.routeButtonText}>VER ROTA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Categoria</Text>
          <Text style={styles.detailValue}>{service.category}</Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Provedor</Text>
          <Text style={styles.detailValue}>{service.provider.name}</Text>
        </View>
      </ScrollView>

      {/* Modal que contém o mapa */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)} // Fecha o modal ao clicar fora ou pressionar 'voltar'
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Mapa exibido no modal */}
            {routePoints && <Map overview_polyline={routePoints} />}

            {/* Botão para fechar o modal */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "#f1f5f9",
  },
  title: {
    color: "#0d141c",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  description: {
    color: "#0d141c",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 25,
  },
  imageScrollContainer: {
    paddingHorizontal: 16,
  },
  imageWrapper: {
    marginRight: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1.5,
    height: 200,
    borderRadius: 8,
  },
  detail: {
    paddingHorizontal: 16,
    paddingVertical: 30,
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
  routeButton: {
    backgroundColor: "#49719c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  routeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    top: "53%",
    width: "100%",
    height: "100%", // Definindo altura para caber o mapa
  },
  closeButton: {
    backgroundColor: "#49719c",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ServiceDetailScreen
