import { Pressable, StyleSheet } from "react-native"
import { Image, Text, View } from "react-native"

import image404 from "../assets/images/404.jpeg"
import { router } from "expo-router"

export default function Service404() {
  const toAddService = () => {
    router.replace("AddServiceScreen")
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={image404} style={styles.heroImage} />
        {/* Overlay escuro */}
        <View style={styles.overlay} />
        {/* Texto sobre a imagem */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Você não possui um serviço (ainda)</Text>
          <Text style={styles.heroSubtitle}>
            Clique no botão abaixo e comece a faturar
          </Text>
        </View>
        <View style={styles.getStarted}>
          <Pressable onPress={toAddService} style={styles.getStartedButton}>
            <Text style={styles.getStartedTextRegister}>Cadastrar Serviço</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFA",
  },
  imageContainer: {
    position: "relative",
    height: 320,
    width: "100%",
  },
  heroImage: {
    height: "100%",
    width: "100%",
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
  heroTextContainer: {
    position: "absolute",
    bottom: "30%",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  heroTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  getStarted: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: "center",
    justifyContent: "space-around",
  },
  getStartedButton: {
    width: "45%",
    backgroundColor: "#607AFB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  getStartedTextRegister: {
    color: "#F9FAFA",
    fontWeight: "bold",
  },
})
