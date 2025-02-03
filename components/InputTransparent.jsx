import { TextInput, View } from "react-native"

export default function InputTransparent({
  placeholder,
  onChange,
  name,
  value,
  onSubmit,
  secureTextEntry,
  style,
}) {
  return (
    <View>
      <View>
        <TextInput
          style={style}
          autoFocus={true}
          placeholder={placeholder}
          placeholderTextColor={"#c7c7c7"}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={(text) => onChange(name, text)}
          onSubmit={onSubmit}
        />
      </View>
    </View>
  )
}
