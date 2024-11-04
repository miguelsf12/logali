import React, { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import Input from "../components/Input"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { changePassword } from "../services/authService"
import ShowSuccess from "../components/ShowSucess"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { useRouter } from "expo-router"

const ChangePassword = () => {
  const [data, setData] = useState({})
  const [error, setError] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    cpf: "",
    password: "",
    passwordConfirm: "",
  })

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
    const response = await changePassword(form)
    setData(response)
    // console.log(response)
    console.log(JSON.stringify(response, null, 2))

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
        setError((prev) => ({
          ...prev,
          [fieldName]: `O campo ${[fieldName]} está faltando.`,
        }))
      } else if (response.message === "As senhas não coincidem") {
        setError({ coincident: "As senhas não coincidem" })
      }
    } else {
      alert(response.message)
      router.replace("LoginScreen")
    }
    console.log(error)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFA", paddingTop: 80 }}>
      <Text style={{ color: "black", paddingHorizontal: 16, fontSize: 15 }}>CPF</Text>
      <Input
        name="cpf"
        value={form.cpf}
        // placeholder={"CPF"}
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
        name="password"
        value={form.password}
        // placeholder={"Senha"}
        onChange={(name, value) => handleInputChange("password", value)}
        secureTextEntry={!showPassword} // Oculta a senha se showPassword for false
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
        name="passwordConfirm"
        value={form.passwordConfirm}
        // placeholder={"Senha"}
        onChange={(name, value) => handleInputChange("passwordConfirm", value)}
        secureTextEntry={!showPassword} // Oculta a senha se showPassword for false
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
    </View>
  )
}

export default ChangePassword
