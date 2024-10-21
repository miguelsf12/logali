import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text } from "react-native"
import MapView, { Marker, Polyline } from "react-native-maps"
import AsyncStorage from "@react-native-async-storage/async-storage"
import polyline from "@mapbox/polyline"
import iconFinish from "../assets/images/location.png"
import iconInit from "../assets/images/maps-and-flags.png"

export default function Map({ overview_polyline }) {
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

          // console.log(routeCoords)

          setRouteCoordinates(routeCoords)
        } catch (error) {
          console.error("Erro ao decodificar polyline:", error)
        }
      }
    }

    fetchLocation()
    fetchRoute()
  }, [location])

  const endPoint =
    routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          customMapStyle={mapStyle}
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05, // Ajuste para um zoom adequad
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
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={4}
                strokeColor="blue" // Cor da linha da rota
              />

              {/* Marcador no ponto final da rota */}
              {endPoint && (
                <Marker coordinate={endPoint} title="Destino" image={iconFinish} />
              )}
            </>
          )}
        </MapView>
      ) : (
        <MapView
          customMapStyle={mapStyle}
          style={styles.map}
          region={{
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
        </MapView>
      )}
    </View>
  )
}

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
]

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
