import React, { useState, useEffect } from "react"
import { View, ActivityIndicator, ImageBackground, Text, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import logo from "../assets/images/logo-logali.png"
import { check_auth } from "../services/authService"

export default function Index() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken")

      // Aguarda 2 segundos antes de redirecionar
      setTimeout(async () => {
        if (token) {
          try {
            const response = await check_auth(token)
            console.log(response)

            if (response.userId) {
              // Se o token for válido, redireciona para HomeScreen
              router.replace("/(tabs)/HomeScreen")
            } else {
              // Se o token não for válido, redireciona para WelcomeScreen
              await AsyncStorage.removeItem("authToken")
              router.replace("/WelcomeScreen")
            }
          } catch (error) {
            console.error("Erro ao verificar autenticação:", error)
            router.replace("/WelcomeScreen") // Caso ocorra um erro, redireciona
          }
        } else {
          router.replace("/WelcomeScreen")
        }

        setLoading(false) // Conclui o carregamento
      }, 2000) // 2000 milissegundos = 2 segundos
    }

    checkAuth()
  }, [])

  if (loading) {
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
