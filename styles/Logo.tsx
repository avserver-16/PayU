import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  width: number;
  height: number;
  borderRadius?: number;
};

const Logo = ({ width, height, borderRadius = 16 }: Props) => {
  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
      ]}
    >
      <Text style={styles.text}>P</Text>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom:12
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#171717",
  },
});