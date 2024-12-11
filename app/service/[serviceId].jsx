import React, { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Linking,
} from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { FontAwesome } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { getRoutesToService, getServiceById } from "../../services/serviceService"
import Map from "../../components/Map"

const ServiceDetailScreen = () => {
  const { serviceId } = useLocalSearchParams()
  const [service, setService] = useState(null)
  const [token, setToken] = useState(null)
  const [routePoints, setRoutePoints] = useState(null)
  const bottomSheetRef = useRef(null)

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
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      {routePoints === null ? (
        <Text style={styles.description}>Carregando</Text>
      ) : (
        <Map style={styles.map} overview_polyline={routePoints} />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={["80%", "40%"]}
        enableOverScroll={true}
      >
        <BottomSheetView style={styles.contentContainer}>
          <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
            <View style={styles.sheetContent}>
              <Text style={styles.title}>{service.name}</Text>
              <Text style={styles.description}>{service.description}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageScrollContainer}
              >
                {service.images?.map((imagePath, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: imagePath }} style={styles.image} />
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
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Categoria</Text>
                <Text style={styles.detailValue}>{service.category}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Provedor</Text>
                <Text style={styles.detailValue}>{service.provider.name}</Text>
              </View>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },
  map: {
    height: "100%",
    width: "100%",
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
})

export default ServiceDetailScreen
