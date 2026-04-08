import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SemiCircleProps {
  value: string;
  title: string;
  subtitle: string;
}

const SemiCircle: React.FC<SemiCircleProps> = ({
  value,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      {/* Semi Circle */}
      <View style={styles.semiCircle}>
        <Text style={styles.valueText}>{value}</Text>
      </View>

      {/* Title & Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default SemiCircle;

const SIZE = 240;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  semiCircle: {
    width: SIZE,
    height: SIZE / 2,
    backgroundColor: "#4CAF50",
    borderTopLeftRadius: SIZE,
    borderTopRightRadius: SIZE,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  valueText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    top: 24
  },

  textContainer: {
    marginTop: 16,
    alignItems: "center",
    
  },

  title: {
  color:"#FAFAFA",
    fontSize:16
  },

  subtitle: {
    fontSize: 14,
    color: "#A1A1A1",
    marginTop: 4,
  },
});