import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import Input from "../components/Input"
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons"
import { login } from "../services/authService"
import ShowSuccess from "../components/ShowSucess"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { useRouter } from "expo-router"
import imageHeader from "../assets/images/car-login-screen.jpeg"

const LoginScreen = () => {
  const [data, setData] = useState({})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const navigation = useNavigation()
  const router = useRouter()

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  })

  const formatCPF = (cpf) => {
    // Remove tudo que não for número
    cpf = cpf.replace(/\D/g, "")

    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11)
    }

    // Adiciona a formatação: XXX.XXX.XXX-XX
    if (cpf.length === 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }

    return cpf
  }

  const handleInputChange = (name, value) => {
    if (name === "identifier") {
      if (!value.includes("@") && value.replace(/\D/g, "").length >= 11) {
        value = formatCPF(value)
      }
    }

    setForm({
      ...form,
      [name]: value,
    })
  }

  const onSubmit = async () => {
    setError({})
    setLoading(true)
    const response = await login(form)
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
        setError((prev) => ({
          ...prev,
          [fieldName]: `O campo ${[fieldName]} está faltando.`,
        }))
      }
    } else {
      const token = response.token
      await AsyncStorage.setItem("authToken", token)
      setShowSuccess(true)
    }
  }

  const handleAnimationFinish = () => {
    router.replace("/(tabs)/HomeScreen")
  }

  const toChangePassword = () => {
    router.push("/ChangePassword")
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: "#F9FAFA" }}>
        <View>
          <ImageBackground
            source={imageHeader}
            style={{
              width: "100%",
              height: 300,
              justifyContent: "flex-end",
              borderRadius: 16,
              marginBottom: 20,
            }}
            imageStyle={{ borderRadius: 16 }}
          />
        </View>

        <Input
          style={{ backgroundColor: "#D1D1D1" }}
          name="identifier"
          value={form.identifier}
          placeholder={"Email ou CPF"}
          onChange={handleInputChange}
          icon={<FontAwesome6 name="user-large" size={24} color="#7D7D7D" />}
        />
        {error.cpf && (
          <Text style={{ color: "red", paddingHorizontal: 16 }}>CPF incorreto</Text>
        )}
        {error.email && (
          <Text style={{ color: "red", paddingHorizontal: 16 }}>Email incorreto</Text>
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
        {error.password && (
          <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.password}</Text>
        )}
        <TouchableOpacity onPress={toChangePassword}>
          <Text style={{ color: "#607AFB", paddingHorizontal: 16 }}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

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
              Entrar
            </Text>
          </TouchableOpacity>
        </View>

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
          Ou faça login nas redes sociais
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
      <ShowSuccess
        showSuccess={showSuccess}
        handleAnimationFinish={handleAnimationFinish}
      />
      {loading && (
        <View
          style={{
            position: "absolute",
            height: 200,
            borderTopEndRadius: 10,
            borderTopStartRadius: 10,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#F7743E",
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>LOGALI</Text>
          <ActivityIndicator size="large" color="#39BFBF" />
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
