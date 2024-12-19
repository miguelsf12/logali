import React, { useState, useEffect } from "react"
import { View, Image, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import logo from "../assets/images/splash.png"
import { check_auth } from "../services/authService"

export default function Index() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken")

      // Aguarda 2 segundos antes de redirecionar

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
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#216A8B",
  },
  logo: {
    width: "100%", // Largura total da tela
    height: "100%", // Altura total da tela
  },
})
