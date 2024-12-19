import { router } from "expo-router"
import { useEffect } from "react"
import { View, Image, StyleSheet, Animated } from "react-native"

const LoadingIndicator = ({ visible, imageSource }) => {
  const scaleValue = new Animated.Value(1)

  useEffect(() => {
    if (visible) {
      const animate = () => {
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => animate())
      }
      animate()
    }
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={imageSource}
        style={[styles.image, { transform: [{ scale: scaleValue }] }]}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
  },
  image: {
    width: 100,
    height: 100,
  },
})

export default LoadingIndicator
