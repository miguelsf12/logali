import React from "react"
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import background from "../assets/images/background.jpeg"
import { useRouter } from "expo-router"

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(2,0,36,1)", "rgba(0,0,0,0.189)", "rgba(0,212,255,0)"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.gradientOverlay}
        />
        <View style={styles.content}>
          <Text style={styles.title}>A sua solução está Logali!</Text>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 20,
                width: 250,
                borderRadius: 50,
                marginBottom: 20,
              }}
              onPress={() => router.push("LoginScreen")}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                ENTRAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 20,
                width: 250,
                borderRadius: 50,
                marginBottom: 20,
              }}
              onPress={() => router.push("RegisterScreen")}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                REGISTRAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignSelf: "center",
    gap: 80,
    marginBottom: 80,
  },
  title: {
    color: "#fff",
    fontSize: 52,
    fontWeight: "800",
    width: 250,
  },
})
