import { View, Text, Pressable, Image, ScrollView, StyleSheet } from "react-native"
import { useEffect, useState } from "react"

export default function ProfileScreen() {
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.heroSection}>
            <Image
              source={{
                uri: "https://cdn.usegalileo.ai/stability/83a0073e-05c1-4d65-9fd5-141fd1d3d424.png",
              }}
              style={styles.heroImage}
            />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Find top-rated massage therapists</Text>
              <Text style={styles.heroSubtitle}>
                Book a same-day massage at your home or office in minutes.
              </Text>
            </View>
            <Pressable style={styles.getStartedButton}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFA",
  },
  heroSection: {
    position: "relative",
    minHeight: 300,
    justifyContent: "flex-end",
    padding: 16,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  heroText: {
    marginBottom: 16,
  },
  heroTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  heroSubtitle: {
    color: "white",
    fontSize: 14,
  },
  getStartedButton: {
    backgroundColor: "#607AFB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  getStartedText: {
    color: "#F9FAFA",
    fontWeight: "bold",
  },
  containerService: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    width: 150,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    elevation: 2, // Adiciona uma leve sombra
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  serviceName: {
    marginTop: 8,
    textAlign: "center",
  },
})
