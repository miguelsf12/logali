import React, { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, View, Text, Image, Pressable, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUserProfile } from "../../services/clientService"
import { getMyService } from "../../services/serviceService"

const ProfileScreen = () => {
  const [token, setToken] = useState(null)
  const [userOn, setUserOn] = useState({})
  const [myService, setMyService] = useState({})
  const navigation = useNavigation()

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)

        if (!token) {
          navigation.navigate("LoginScreen")
        }

        const myService = await getMyService(token)
        setMyService(myService)

        const user = await getUserProfile(token)
        setUserOn(user)

        console.log(JSON.stringify(user, null, 2))
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    checkToken()
  }, [token, navigation])

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Substitua pela URL da imagem
          style={styles.profileImage}
        />
        {userOn.name ? (
          <Text style={styles.name}>{userOn.name}</Text>
        ) : (
          <Text style={styles.name}>Carregando nome</Text>
        )}

        {userOn.address ? (
          <Text style={styles.location}>{userOn.address["address"]}</Text>
        ) : (
          <Text style={styles.location}>Carregando localização</Text>
        )}
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>

        {/* About Section */}
        <Text style={styles.sectionTitle}>Sobre mim</Text>
        <View style={styles.aboutContainer}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutItemTitle}>Meu serviço</Text>
            {/* <Text style={styles.aboutItemSubtitle}>{myService.name}</Text> */}
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutItemTitle}>Serviços Favoritos (IMPLEMENTAR)</Text>
            <Text style={styles.aboutItemSubtitle}>500+ connections</Text>
          </View>
        </View>

        {/* Recently Contracted Services */}
        {/* <Text style={styles.sectionTitle}>Recently Contracted Services</Text>
        <View style={styles.servicesContainer}>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceDescription}>Get introduced to Robert...</Text>
            <Text style={styles.serviceNote}>He accepts most intros</Text>
            <Pressable style={styles.serviceButton}>
              <Text style={styles.serviceButtonText}>Ask for intro</Text>
            </Pressable>
          </View>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceDescription}>Get feedback on your startup...</Text>
            <Text style={styles.serviceNote}>Pitching, Fundraising</Text>
            <Pressable style={styles.serviceButton}>
              <Text style={styles.serviceButtonText}>Book now</Text>
            </Pressable>
          </View>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceDescription}>Get help with investor updates</Text>
            <Text style={styles.serviceNote}>Fundraising, Startups</Text>
            <Pressable style={styles.serviceButton}>
              <Text style={styles.serviceButtonText}>Book now</Text>
            </Pressable>
          </View>
        </View> */}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 60,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  location: {
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 16,
    color: "gray",
    textAlign: "center",
  },
  jobTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  aboutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  aboutItem: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  aboutItemTitle: {
    fontWeight: "bold",
  },
  aboutItemSubtitle: {
    color: "gray",
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceItem: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  serviceDescription: {
    fontWeight: "bold",
  },
  serviceNote: {
    color: "gray",
    marginBottom: 5,
  },
  serviceButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  serviceButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default ProfileScreen
