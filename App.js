import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Chatbot from './Chatbot';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Chatbot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    length: '100%',
    width: '100%',
    paddingTop: 30,
  },
});
