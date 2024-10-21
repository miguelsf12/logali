import { TextInput, View } from "react-native"

export default function Input({
  placeholder,
  onChange,
  name,
  value,
  onSubmit,
  icon,
  secureTextEntry,
}) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#EEEFF2",
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: 16,
            fontSize: 16,
            color: "#1C1D22",
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={(text) => onChange(name, text)}
          onSubmit={onSubmit}
        />
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: "#EEEFF2",
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          {/* Envelope Icon */}
          {icon ? icon : ""}
        </View>
      </View>
    </View>
  )
}
