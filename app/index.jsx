import React, { useState, useEffect } from "react"
import { View, ActivityIndicator, ImageBackground, Text, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import logo from "../assets/images/logo-logali.png"

export default function Index() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken")

      // Aguarda 2 segundos antes de redirecionar
      setTimeout(() => {
        if (token) {
          router.replace("/(tabs)/HomeScreen")
        } else {
          router.replace("/WelcomeScreen")
        }

        setLoading(false) // Conclui o carregamento
      }, 2000) // 2000 milissegundos = 2 segundos
    }

    checkAuth()
  }, [])

  if (loading) {
    // Exibe o indicador de carregamento enquanto verifica o token
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#216A8B",
        }}
      >
        <Image source={logo}></Image>
      </View>
    )
  }

  return null
}
