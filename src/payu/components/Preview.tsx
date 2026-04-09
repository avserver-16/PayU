import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PreviewProps {
  email: string;
  financeProfile: any;
}

const Preview: React.FC<PreviewProps> = ({ email, financeProfile }) => {
  const data = [
    ['Total Spendings:', financeProfile?.monthlyExpenses*12 || '$0'],
    ['Email:', email],
    ['Balance:', financeProfile?.netWorth || '$0'],
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
                  {isValue && (item === financeProfile?.monthlyExpenses*12||item === financeProfile?.netWorth) ? `${financeProfile.currency}${' '}${item.toFixed(2)}` : item}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
      <Text style={styles.disclaimer}>Disclaimer: Data is annually calculated over a period of 1 year.</Text>
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
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    marginTop: 12,
  },
});