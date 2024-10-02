import { View, Text, StyleSheet, Pressable, Image, ScrollView } from "react-native"

const popularServices = [
  { id: 1, name: "Serviço 1", image: "url_imagem_1" },
  { id: 2, name: "Serviço 2", image: "url_imagem_2" },
  { id: 3, name: "Serviço 3", image: "url_imagem_3" },
]

export default function HomeScreen() {
  return (
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

        {/* Popular services */}
        <View style={styles.containerService}>
          <Text style={styles.title}>Serviços Populares</Text>
          
          <ScrollView
            horizontal={true}
            style={styles.scrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {popularServices.map((service) => (
              <View key={service.id} style={styles.card}>
                <Image source={{ uri: service.image }} style={styles.image} />
                <Text style={styles.serviceName}>{service.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    color: "#1C1D22",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchButton: {
    width: 24,
    height: 24,
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
  scrollContainer: {
    paddingVertical: 10,
  },
  card: {
    width: 150,
    marginRight: 10,
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

