import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

const GeneratedCodeBlock = ({ code }) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#f8f8f2';

  return (
    <View style={styles.codeBlock}>
      <Text style={[styles.codeText, { color: textColor }]}>{code}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  codeBlock: {
    backgroundColor: '#272822', // Monokai background color
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  codeText: {
    fontFamily: 'monospace',
  },
});

export default GeneratedCodeBlock;
