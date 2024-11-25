import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text } from "react-native"
import MapView, { Marker, Polyline } from "react-native-maps"
import AsyncStorage from "@react-native-async-storage/async-storage"
import polyline from "@mapbox/polyline"
import iconFinish from "../assets/images/location.png"
import iconInit from "../assets/images/maps-and-flags.png"

export default function Map({ overview_polyline, style }) {
  const [location, setLocation] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])

  useEffect(() => {
    const fetchLocation = async () => {
      const storedLocation = await AsyncStorage.getItem("actualLocation")
      if (storedLocation) {
        setLocation(JSON.parse(storedLocation))
      }
    }

    const fetchRoute = async () => {
      if (overview_polyline) {
        try {
          // Decodifique a polyline para obter as coordenadas
          const routePoints = polyline.decode(overview_polyline)
          const routeCoords = routePoints.map((point) => ({
            latitude: point[0],
            longitude: point[1],
          }))
          setRouteCoordinates(routeCoords)
        } catch (error) {
          console.error("Erro ao decodificar polyline:", error)
        }
      }
    }

    fetchLocation()
    fetchRoute()
  }, [overview_polyline]) // A dependência aqui deve ser apenas `overview_polyline`, pois location só é carregado uma vez.

  const endPoint =
    routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null

  // Verifique se a localização foi carregada antes de renderizar o mapa
  if (!location) {
    return <Text>Carregando a localização...</Text>
  }

  return (
    <View style={[style, styles.container]}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title={location.address}
          image={iconInit}
        />

        {/* Polyline mostrando o trajeto */}
        {routeCoordinates.length > 0 && (
          <>
            <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
            {/* Marcador no ponto final da rota */}
            {endPoint && (
              <Marker coordinate={endPoint} title="Destino" image={iconFinish} />
            )}
          </>
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
})
