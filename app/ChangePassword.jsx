import React, { useState } from "react"
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import Input from "../components/Input"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { changePassword } from "../services/authService"
import { useRouter } from "expo-router"

const ChangePassword = () => {
  const [data, setData] = useState({})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    cpf: "",
    password: "",
    passwordConfirm: "",
  })

  const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "")

    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11)
    }
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
    const response = await changePassword(form)
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
      } else if (response.message === "As senhas não coincidem") {
        setError({ coincident: "As senhas não coincidem" })
      }
    } else {
      Alert.alert(response.message)
      router.replace("LoginScreen")
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFA", paddingTop: 80 }}>
      <Text style={{ color: "black", paddingHorizontal: 16, fontSize: 15 }}>CPF</Text>
      <Input
        style={{ backgroundColor: "#D1D1D1" }}
        name="cpf"
        value={form.cpf}
        onChange={(name, value) => handleInputChange("cpf", value)}
        icon={<AntDesign name="idcard" size={24} color="#7D7D7D" />}
      />
      {error.cpf && (
        <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.cpf}</Text>
      )}

      <Text style={{ color: "black", paddingHorizontal: 16, fontSize: 15 }}>
        Nova senha
      </Text>
      <Input
        style={{ backgroundColor: "#D1D1D1" }}
        name="password"
        value={form.password}
        onChange={(name, value) => handleInputChange("password", value)}
        secureTextEntry={!showPassword}
        icon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#607AFB" />
          </TouchableOpacity>
        }
      />
      {error.password && (
        <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.password}</Text>
      )}

      <Text style={{ color: "black", paddingHorizontal: 16, fontSize: 15 }}>
        Confirme a nova senha
      </Text>
      <Input
        style={{ backgroundColor: "#D1D1D1" }}
        name="passwordConfirm"
        value={form.passwordConfirm}
        onChange={(name, value) => handleInputChange("passwordConfirm", value)}
        secureTextEntry={!showPassword}
        icon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#607AFB" />
          </TouchableOpacity>
        }
      />

      {error.coincident && (
        <Text style={{ color: "red", paddingHorizontal: 16 }}>{error.coincident}</Text>
      )}

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
            Alterar senha
          </Text>
        </TouchableOpacity>
      </View>
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
    </View>
  )
}

export default ChangePassword
