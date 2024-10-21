import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import Input from "../components/Input"
import Ionicons from "@expo/vector-icons/Ionicons"
import Entypo from "@expo/vector-icons/Entypo"
import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { register } from "../services/authService"
import { useNavigation } from "@react-navigation/native"
import ShowSuccess from "../components/ShowSucess"

const RegisterScreen = () => {
  const [data, setData] = useState({})
  const [error, setError] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    address: "",
  })

  const navigation = useNavigation()

  const handleInputChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  const onSubmit = async () => {
    setError({})
    const response = await register(form)
    setData(response)

    if (response.status === "400") {
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
      setShowSuccess(true)
    }

    console.log(error)
    console.log(data)
  }

  const handleAnimationFinish = () => {
    navigation.navigate("LoginScreen")
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, backgroundColor: "#F9FAFA" }}>
          {/* Background Image */}
          <View>
            <ImageBackground
              source={{
                uri: "https://cdn.usegalileo.ai/stability/f29c18e0-b114-4180-950a-2356672b72d6.png",
              }}
              style={{
                width: "100%",
                height: 300,
                justifyContent: "flex-end",
                borderRadius: 16,
              }}
              imageStyle={{ borderRadius: 16 }}
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
            name="cpf"
            value={form.cpf}
            placeholder={"CPF"}
            onChange={handleInputChange}
            icon={<AntDesign name="idcard" size={24} color="#7D7D7D" />}
          />
          {error && (
            <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.cpf}</Text>
          )}

          <Input
            name="password"
            value={form.password}
            placeholder={"Senha"}
            onChange={handleInputChange}
            icon={<FontAwesome5 name="key" size={24} color="#7D7D7D" />}
          />
          {error.password && (
            <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.password}</Text>
          )}

          <Input
            name="address"
            value={form.address}
            placeholder={"Endereço"}
            onChange={handleInputChange}
            icon={<Ionicons name="location-sharp" size={24} color="#7D7D7D" />}
          />

          {/* Sign Up Button */}
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
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Media Sign-In */}
          <Text
            style={{
              color: "#3C3F4A",
              fontSize: 14,
              textAlign: "center",
              paddingBottom: 12,
              paddingTop: 8,
            }}
          >
            Ou faça registro com redes sociais
          </Text>

          {/* Social Media Buttons */}
          <View
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
          </View>

          {/* Footer Space */}
          <View style={{ height: 20, backgroundColor: "#F9FAFA" }} />
        </View>
      </ScrollView>

      <ShowSuccess
        showSuccess={showSuccess}
        handleAnimationFinish={handleAnimationFinish}
      />
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen
