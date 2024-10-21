import FontAwesome from "@expo/vector-icons/FontAwesome"
import React from "react"
import { Tabs } from "expo-router"
import { FontAwesome6 } from "@expo/vector-icons"

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="MapScreen"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />,
        }}
      />

      <Tabs.Screen
        name="OwnerServiceScreen"
        options={{
          title: "Meu Serviço",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="briefcase" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
