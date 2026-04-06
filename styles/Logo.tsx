import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  width: number;
  height: number;
};

const Logo = ({ width, height }: Props) => {
  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
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
    borderRadius: 16,
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