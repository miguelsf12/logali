import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native"
import Input from "../components/Input"
import Entypo from "@expo/vector-icons/Entypo"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { debounce } from "lodash"
import { getServicesFiltered } from "../services/serviceService"
import { router } from "expo-router"

export default function SearchScreen() {
  const [token, setToken] = useState(null)
  const [filter, setFilter] = useState({})
  const [servicesFound, setServicesFound] = useState([])

  const handleInputChange = (name, value) => {
    setFilter((prevForm) => ({
      ...prevForm,
      [name]: value, // Atualiza apenas a chave especificada.
      category: value,
    }))
    console.log(filter)
  }

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        setToken(token)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    checkToken()
  }, [token])

  const toService = (serviceId) => {
    router.push(`/service/${serviceId}`)
  }

  const onSubmit = async () => {
    if (Object.keys(filter).length === 0 || !filter.name?.trim()) {
      // Verifica se o filtro está vazio ou se o campo "name" está em branco
      alert("Por favor, insira um termo para a busca.")
      return
    }

    try {
      const response = await getServicesFiltered(filter, token)
      setServicesFound(response)
      console.log(JSON.stringify(response, null, 2))
    } catch (error) {
      console.error("Erro ao buscar serviços filtrados:", error)
    }
  }

  return (
    <View style={styles.container}>
      {/* <Input
        placeholder="Procure o serviço que deseja"
        style={{ backgroundColor: "#E8E8E8", fontSize: 12 }}
        name="filter"
        onChange={handleInputChange}
        icon={
          <Entypo name="magnifying-glass" onPress={onSubmit} size={24} color="black" />
        }
      /> */}

      {/* Input */}
      <View>
        <View
          style={{
            flexDirection: "row",
            borderRadius: 16,
            alignItems: "center",
            backgroundColor: "#E8E8E8",
          }}
        >
          <TextInput
            autoFocus={false}
            placeholder="Procure o serviço que deseja"
            style={{
              flex: 1,
              padding: 16,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              height: 53,
              fontSize: 12,
              color: "#1C1D22",
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            }}
            onChangeText={(value) => handleInputChange("name", value)} // Especifica a chave a ser atualizada.
            onSubmitEditing={onSubmit} // Corrigido para acionar o evento no teclado "Enter".
          />
          <View
            style={{
              paddingHorizontal: 16,
              // backgroundColor: "#EEEFF2",
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
            }}
          >
            <Entypo name="magnifying-glass" onPress={onSubmit} size={24} color="black" />
          </View>
        </View>
      </View>

      <ScrollView vertical={true}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersOptions}>
            <TouchableOpacity style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Todos os serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Borracharia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Limpeza</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Organização de Eventos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.contentsService}>
          {servicesFound.length === 0 && (
            <Text
              style={{ color: "#a7a7a7", marginTop: 20, fontSize: 17, fontWeight: "600" }}
            >
              {Object.keys(filter).length === 0
                ? "Experimente fazer uma busca, talvez ela te ajude!"
                : "Serviço não encontrado"}
            </Text>
          )}

          {servicesFound.length !== 0 &&
            servicesFound.map((service) => (
              <TouchableOpacity
                key={service._id}
                style={styles.cardService}
                onPress={() => toService(service._id)}
              >
                <Image
                  source={{
                    uri: `${service.images[0]}`,
                  }}
                  style={styles.image}
                />
                <View style={styles.contentText}>
                  <Text style={{ fontSize: 17, fontWeight: 600 }}>{service.name}</Text>
                  <Text
                    style={{ flex: 1, marginRight: 20 }}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {service.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
  },
  filtersOptions: {
    marginTop: 13,
    flexDirection: "row",
    gap: 10,
  },
  filterOption: {
    backgroundColor: "#E8E8E8",
    fontSize: 12,
    padding: 8,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterOptionText: {
    fontSize: 12,
  },
  contentsService: {
    width: "100%",
    flexDirection: "column",
    alignSelf: "center",
  },
  cardService: {
    marginTop: 20,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  contentText: {
    paddingLeft: 14,
    paddingBottom: 10,
  },
  image: {
    width: 130,
    height: 80,
    borderRadius: 8,
  },
})
