import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text } from "react-native"
import MapView, { Marker } from "react-native-maps"
import AsyncStorage from "@react-native-async-storage/async-storage"
import iconMarker from "../assets/images/pin.png"

export default function Map() {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    const fetchLocation = async () => {
      const storedLocation = await AsyncStorage.getItem("actualLocation")
      if (storedLocation) {
        setLocation(JSON.parse(storedLocation))
      }
    }

    fetchLocation()
  }, [location])

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01, // Zoom aproximado
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.address}
            image={iconMarker}
          />
        </MapView>
      ) : (
        <Text>Carregando mapa...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})
