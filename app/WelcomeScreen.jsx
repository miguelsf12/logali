import React from "react"
import { View, Text, ImageBackground, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Button from "../components/Button"
import background from "../assets/images/background.jpeg"

export default function WelcomeScreen() {
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
        <Text style={styles.title}>A sua solução está Logali!</Text>
        <View style={styles.authContainer}>
          <Button text={"LOGIN"} href={"/LoginScreen"} />
          <Button text={"REGISTER"} href={"/RegisterScreen"} />
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    position: "absolute",
    left: 70,
    color: "#fff",
    alignSelf: "center",
    fontSize: 52,
    fontWeight: "800",
    width: 250,
  },
  authContainer: {
    position: "absolute",
    bottom: "8%",
    marginTop: 10,
    alignSelf: "center",
  },
})
