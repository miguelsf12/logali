import LottieView from "lottie-react-native"
import { useState } from "react"
import { View } from "react-native"

export default function ShowSuccess({ showSuccess, handleAnimationFinish }) {
  return (
    showSuccess && (
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <LottieView
          source={require("../assets/images/animationcheck.json")}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
          onAnimationFinish={handleAnimationFinish}
        />
      </View>
    )
  )
}
