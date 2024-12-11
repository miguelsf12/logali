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
        style={[
          {
            flexDirection: "row",
            borderRadius: 16,
            alignItems: "center",
          },
          style,
        ]}
      >
        <TextInput
          autoFocus={false}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: 16,
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
            height: 53,
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
          style={[
            {
              paddingHorizontal: 16,
              // backgroundColor: "#EEEFF2",
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
            },
            style,
          ]}
        >
          {/* Envelope Icon */}
          {icon ? icon : ""}
        </View>
      </View>
    </View>
  )
}
