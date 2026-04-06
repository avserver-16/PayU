import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
};

const GradientBackground = ({ children, style }: Props) => {
  return (
    <LinearGradient
      colors={["#0A0A0A", "#0A0A0A"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:16
  },
});
