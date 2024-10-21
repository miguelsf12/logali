import { Link } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export default function Button({ href, text }) {
  return (
    <View style={styles.container}>
      <Link style={styles.text} href={href}>
        <Text>{text}</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    width: 250,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
  },
})
