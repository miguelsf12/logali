import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import Input from "../components/Input"
import Ionicons from "@expo/vector-icons/Ionicons"
import Entypo from "@expo/vector-icons/Entypo"
import AntDesign from "@expo/vector-icons/AntDesign"
import { register } from "../services/authService"
import * as Location from "expo-location"
import { sendActualLocation } from "../services/clientService"
import { useRouter } from "expo-router"
import imageHeader from "../assets/images/car-register-screen.jpeg"
import LoadingIndicator from "../components/LoadingIndicator"

const RegisterScreen = () => {
  const [data, setData] = useState({})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    address: "",
  })

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    const { latitude, longitude } = location.coords
    const coords = [latitude, longitude]
    const address = `${coords[0]}, ${coords[1]}`

    let loc = await sendActualLocation({ address })
    setForm((prev) => ({ ...prev, address: loc.address }))
  }

  const router = useRouter()

  const formatCPF = (cpf) => {
    // Remove tudo que não for número
    cpf = cpf.replace(/\D/g, "")

    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11)
    }

    // Adiciona a formatação: XXX.XXX.XXX-XX
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }

    return cpf
  }

  const handleInputChange = (name, value) => {
    if (name === "cpf") {
      value = formatCPF(value)
    }

    setForm({
      ...form,
      [name]: value,
    })
  }

  const onSubmit = async () => {
    setError({})
    setLoading(true)
    const response = await register(form)
    setData(response)
    setLoading(false)

    if (response.status === 400) {
      const errorField = response.message.match(/Invalid param: (\w+)/)
      const errorFieldMissing = response.message.match(/Missing param: (\w+)/)

      if (errorField) {
        const fieldName = errorField[1]
        setError((prev) => ({
          ...prev,
          [fieldName]: `O campo ${[fieldName]} é inválido`,
        }))
      } else if (errorFieldMissing) {
        const fieldName = errorFieldMissing[1]
        setError((prev) => ({ ...prev, [fieldName]: "O campo está faltando." }))
      }
    } else {
      router.replace("LoginScreen")
    }

    console.log(error)
    console.log(data)
  }

  const handleAnimationFinish = () => {
    // navigation.navigate("LoginScreen")
    router.replace("LoginScreen")
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#F9FAFA" }}
      >
        <View style={{ flex: 1}}>
          {/* Background Image */}
          <View>
            <ImageBackground
              source={imageHeader}
              style={{
                width: "100%",
                height: 300,
                justifyContent: "flex-end",
                borderRadius: 16,
              }}
              imageStyle={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
            />
          </View>

          {/* Title */}
          <Text
            style={{
              color: "#1C1D22",
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 12,
              paddingTop: 20,
            }}
          >
            Encontre próximo de você a solução para o seu problema
          </Text>

          <Input
            style={{ backgroundColor: "#D1D1D1" }}
            name="name"
            value={form.name}
            placeholder={"Nome"}
            onChange={handleInputChange}
            icon={<Ionicons name="person" size={24} color="#7D7D7D" />}
          />
          {error.name && (
            <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.name}</Text>
          )}

          <Input
            style={{ backgroundColor: "#D1D1D1" }}
            name="email"
            value={form.email}
            placeholder={"Email"}
            onChange={handleInputChange}
            icon={<Entypo name="mail" size={24} color="#7D7D7D" />}
          />
          {error.email && (
            <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.email}</Text>
          )}

          <Input
            style={{ backgroundColor: "#D1D1D1" }}
            name="cpf"
            value={form.cpf}
            placeholder={"CPF"}
            onChange={(name, value) => handleInputChange("cpf", value)}
            icon={<AntDesign name="idcard" size={24} color="#7D7D7D" />}
          />
          {error.cpf && (
            <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.cpf}</Text>
          )}

          <Input
            style={{ backgroundColor: "#D1D1D1" }}
            name="password"
            value={form.password}
            placeholder={"Senha"}
            onChange={(name, value) => handleInputChange("password", value)}
            secureTextEntry={!showPassword} // Oculta a senha se showPassword for false
            icon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={24}
                  color="#607AFB"
                />
              </TouchableOpacity>
            }
          />
          <Text style={{ color: "black", paddingHorizontal: 16 }}>
            {`A senha deve ter maiúscula, minúscula um número e um caractere especial (ex.: *,.!@)`}
          </Text>
          {error.password && (
            <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.password}</Text>
          )}

          {/* Input de endereço com ícone de localização */}
          <Input
            style={{ backgroundColor: "#D1D1D1" }}
            name="address"
            value={form.address} // Apenas use o valor do form para o endereço
            placeholder={"Endereço"}
            onChange={(name, value) => handleInputChange("address", value)} // Certifique-se de que onChange está salvando corretamente o input do usuário
            icon={
              <TouchableOpacity onPress={handleGetLocation}>
                <Ionicons name="location-sharp" size={24} color="#607AFB" />
              </TouchableOpacity>
            }
          />
          <Text style={{ color: "black", paddingHorizontal: 16 }}>
            Insira seu endereço ou local atual clicando no icone
          </Text>
          {error.address && (
            <Text style={{ color: "red", paddingHorizontal: 16 }}>
              Preencha o endereço
            </Text>
          )}
          {!loading ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#607AFB",
                  borderRadius: 16,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={onSubmit}
              >
                <Text style={{ color: "#F9FAFA", fontWeight: "bold", fontSize: 16 }}>
                  Registrar
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 40 }}>
              <LoadingIndicator
                visible={loading}
                imageSource={require("../assets/images/adaptive-icon.png")}
              />
            </View>
          )}

          {/* Social Media Sign-In */}
          {/* <Text
            style={{
              color: "#3C3F4A",
              fontSize: 14,
              textAlign: "center",
              paddingBottom: 12,
              paddingTop: 8,
            }}
          >
            Ou faça registro com redes sociais
          </Text> */}

          {/* Social Media Buttons */}
          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#D5D6DD",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 16,
              }}
            >
              <Text>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#D5D6DD",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 16,
              }}
            >
              <Text>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#D5D6DD",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 16,
              }}
            >
              <Text>Facebook</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen
