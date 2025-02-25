import React from "react"
import { TextInput, View, StyleSheet } from "react-native"

export default function InputOutlined({
  placeholder,
  onChange,
  name,
  value,
  icon,
  editable,
  style,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          autoFocus={false}
          placeholder={placeholder}
          placeholderTextColor={"#c7c7c7"}
          style={[style, styles.textInput]}
          value={value}
          onChangeText={(text) => onChange(name, text)}
          editable={editable}
        />
        <View style={styles.iconWrapper}>{icon ? icon : ""}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    borderRadius: 16,
    alignItems: "center",
    borderColor: "#CCC", // Cor da borda
    borderWidth: 1, // Largura da borda
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#1C1D22",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconWrapper: {
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
})
