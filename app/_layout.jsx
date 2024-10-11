import React from "react"
import { Stack, Tabs } from "expo-router"

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Bem-vindo" }} />
      <Stack.Screen name="WelcomeScreen" options={{ title: "Welcome" }} />
      <Stack.Screen name="LoginScreen" options={{ title: "Login" }} />
      <Stack.Screen name="RegisterScreen" options={{ title: "Registrar" }} />
      <Stack.Screen name="AddServiceScreen" options={{ title: "Adicionar Serviço" }} />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default Layout
