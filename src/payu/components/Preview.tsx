import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PreviewProps {
  email: string;
}

const Preview: React.FC<PreviewProps> = ({ email }) => {
  const data = [
    ['Total Spendings:', '$2000'],
    ['Email:', email],
    ['Balance:', '$20000'],
  ];

  return (
    <View style={styles.container}>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, colIndex) => {
            const isValue = colIndex === 1; 

            return (
              <View
                key={colIndex}
                style={[
                  styles.box,
                  isValue ? styles.valueBox : styles.labelBox,
                ]}
              >
                <Text
                  style={[
                    
                    isValue ? styles.valueText : styles.labelText,
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:24
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  box: {
    // width: '48%',
  },

  // LEFT → Labels
  labelBox: {
    alignItems: 'flex-start',
  },
  labelText: {
    color: '#A1A1A1',
    fontSize: 16,
  },

  // RIGHT → Values
  valueBox: {
    alignItems: 'flex-end',
  },
  valueText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: '600',
  },
});