import { TextInput, View } from "react-native"

export default function Input({
  placeholder,
  onChange,
  name,
  value,
  onSubmit,
  icon,
  secureTextEntry,
  style,
}) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <View
        style={{
          flexDirection: "row",
          borderRadius: 16,
          alignItems: "center",
          backgroundColor: "#D1D1D1",
        }}
      >
        <TextInput
          autoFocus={false}
          placeholder={placeholder}
          placeholderTextColor={"#7d7d7d"}
          style={{
            flex: 1,
            padding: 16,
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
            height: 53,
            fontSize: 16,
            color: "#7d7d7d",
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={(text) => onChange(name, text)}
          onSubmit={onSubmit}
        />
        <View
          style={[
            {
              paddingHorizontal: 16,
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
            },
            style,
          ]}
        >
          {icon ? icon : ""}
        </View>
      </View>
    </View>
  )
}
