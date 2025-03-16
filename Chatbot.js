import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Modal, Animated, ScrollView, ActivityIndicator, Image } from 'react-native';
import GeneratedCodeBlock from './GeneratedCodeBlock';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState([]); 
  const [showInfo, setShowInfo] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogo, setShowLogo] = useState(true); 
  const slideAnim = useState(new Animated.Value(-300))[0]; 
  const [shineAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [logoFadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shineAnim]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(logoFadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 3000); // Show logo for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const shineInterpolation = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(0, 157, 255)', 'rgb(255, 255, 255)'],
  });

  const handleSend = async () => {
    if (input.trim() === '') return;
    setLoading(true);
    const userMessage = input;
    setResponses([...responses, { text: userMessage, isUser: true }]);
    setInput('');

    const lowerCaseInput = userMessage.toLowerCase();
    if (lowerCaseInput.includes('who developed you') || lowerCaseInput.includes('who is your developer') || lowerCaseInput.includes('your developer') || lowerCaseInput.includes('who is your creator') || lowerCaseInput.includes('your creator') || lowerCaseInput.includes('who develop you') || lowerCaseInput.includes('who is your developer') || lowerCaseInput.includes('who is your creator') || lowerCaseInput.includes('who create you') || lowerCaseInput.includes('who is your creator') || lowerCaseInput.includes('who is your developer') || lowerCaseInput.includes('who is your creator') || lowerCaseInput.includes('who is your developer') || lowerCaseInput.includes('who is your creator') || lowerCaseInput.includes('who is your developer') || lowerCaseInput.includes('who is your creator')) {
      setResponses(prevResponses => [...prevResponses, { text: 'I Was Developed by Nikhil Rajesh Golait.', isUser: false }]);
      setLoading(false);
      return;
    }
    if (lowerCaseInput.includes('what is your name') || lowerCaseInput.includes('your name') || lowerCaseInput.includes('who are you') || lowerCaseInput.includes('what are you') || lowerCaseInput.includes('your creator')) {
      setResponses(prevResponses => [...prevResponses, { text: 'My name is Nikki. I am an AI Assistant developed by Nikhil Golait. I am based on Google\'s V1 beta Gemini 1.5 flash model.', isUser: false }]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDgfGaQ5bRhVB4buzqw8zisfSPZv8-oPYY', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: userMessage }]
          }]
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Full response:', data); 
      if (data.candidates && data.candidates.length > 0) {
        console.log('First candidate:', data.candidates[0]); 
        if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
          const responseText = data.candidates[0].content.parts[0].text;
          const codeMatch = responseText.match(/```[\s\S]*?```/g);
          const explanation = responseText.replace(/```[\s\S]*?```/g, '').trim().split('**').map((part, index) => 
            index % 2 === 1 ? <Text key={index} style={{fontWeight: 'bold'}}>{part}</Text> : part
          );
          const formattedResponse = codeMatch ? (
            <>
              <GeneratedCodeBlock code={codeMatch[0].replace(/```/g, '')} />
              <Text style={styles.generatedTextDark}>{explanation}</Text>
            </>
          ) : <Text style={styles.generatedTextDark}>{explanation}</Text>;
          setResponses(prevResponses => [...prevResponses, { text: formattedResponse, isUser: false }]);
        } else {
          setResponses(prevResponses => [...prevResponses, { text: 'Error: Unexpected response structure', isUser: false }]);
        }
      } else {
        setResponses(prevResponses => [...prevResponses, { text: 'Error: No candidates found in response', isUser: false }]);
      }
    } catch (error) {
      console.error('Network request failed', error);
      if (error.message.includes('Network request failed')) {
        console.error('Possible CORS issue or network problem');
      }
      setResponses(prevResponses => [...prevResponses, { text: 'Error: Unable to fetch response', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  if (showLogo) {
    return (
      <View style={styles.logoContainer}>
        <Animated.Image source={require('./assets/coeta_logo.png')} style={[styles.logo, { opacity: logoFadeAnim }]} />
        <Animated.Text style={[styles.logoText, { opacity: logoFadeAnim }]}>COETA AI</Animated.Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, styles.darkContainer, { opacity: fadeAnim }]}> 
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <Text style={[styles.menuButtonText, styles.darkMenuButtonText]}>☰</Text>
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={menuVisible}
        onRequestClose={closeMenu}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeMenu}>
          <Animated.View style={[styles.sidebar, styles.darkSidebar, { transform: [{ translateX: slideAnim }] }]}>
            <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
              <Text style={[styles.menuItem, styles.darkMenuItem, {fontWeight: 'bold'}]}>My Information</Text>
            </TouchableOpacity>
            {showInfo && (
              <ScrollView style={[styles.infoBlock, styles.darkInfoBlock]}>
                <Text style={[styles.infoText, styles.darkModeText]}>
                  <Text style={{ color: 'red' }}>Developed by</Text> {'\n'}
                  <Text style={{ fontWeight: 'bold' }}>Nikhil Rajesh Golait</Text>{'\n'}
                  Student of section A, 2nd Year{'\n'}
                  (Computer Science & Engineering){'\n\n'}
                  <Text style={{ color: 'red' }}>Under the guidance of</Text> {'\n'}
                  <Text style={{ fontWeight: 'bold' }}>Dr. R. S. Jaiswal</Text>,{'\n'}
                  Professor, {'\n'}(Computer Science & Engineering),{'\n'}
                  <Text style={{ fontWeight: 'bold' }}>Dr. S. L. Satarkar</Text>,{'\n'}
                  Head of Department,{'\n'}(Computer Science & Engineering)
                  <Text style={{ fontWeight: 'bold' }}>{'\n'}College Of Engineering & Technology, {'\n'}Akola, Maharashtra, India</Text>{'\n'} 
                </Text>
              </ScrollView>
            )}
            <TouchableOpacity onPress={closeMenu}>
              <Text style={[styles.closeButton, styles.darkModeText]}>Close</Text>
            </TouchableOpacity>
            <Text style={[styles.newUpdatesText, styles.darkModeText]}>{'\n\n'}New Updates Coming Soon...</Text>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      <Image source={require('./assets/coeta_logo.png')} style={styles.logo} />
      <View style={styles.headingContainer}>
        <Text style={[styles.heading, styles.darkHeading, {fontWeight: 'bold'}]}>
          COETA AI
        </Text>
      </View>
      <View style={styles.responseContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {loading ? <ActivityIndicator size="large" color="#fff" /> : responses.map((res, index) => (
            <View key={index} style={[styles.responseWrapper, res.isUser ? styles.userMessageDark : styles.botMessageDark]}>
              {React.isValidElement(res.text) ? res.text : (
                <Text style={res.isUser ? styles.userTextDark : styles.generatedTextDark}>
                  {res.text}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.darkInput]}
          placeholder="Type your message..."
          placeholderTextColor="#ccc"
          value={input}
          onChangeText={setInput}
          onKeyPress={handleKeyPress}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: 'rgb(0, 0, 33)',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  menuButtonText: {
    fontSize: 30,
    color: 'darkblue',
  },
  darkMenuButtonText: {
    color: 'rgb(0, 157, 255)',
  },
  darkModeText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    height: '100%',
    backgroundColor: '#fff',
    textAlign: 'center',
    padding: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  darkSidebar: {
    backgroundColor: 'rgb(0, 0, 33)',
  },
  menuItem: {
    fontSize: 18,
    marginTop: 90,
    color: 'darkblue',
    marginBottom: 0,
  },
  darkMenuItem: {
    color: 'rgb(0, 157, 255)',
  },
  closeButton: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
  infoBlock: {
    padding: 0,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    marginVertical: 10,
  },
  darkInfoBlock: {
    backgroundColor: 'rgb(0, 0, 33)',
  },
  infoText: {
    fontSize: 16,
    color: 'black',
    lineHeight: 24,
  },
  darkInfoText: {
    color: '#fff',
  },
  responseContainer: {
    flex: 1,
    marginTop: 20,
    maxHeight: 550, 
    padding: 15, 
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  responseWrapper: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '95%',
  },
  userMessageDark: {
    alignSelf: 'flex-end',
    backgroundColor: '#005BB5', // Darker blue color for dark mode
    color: '#fff',
  },
  botMessageDark: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgb(0,0,40)', // Darker gray color for dark mode
    color: '#fff',
  },
  userTextDark: {
    color: '#fff',
  },
  generatedTextDark: {
    color: '#fff',
  },
  headingContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    color: 'darkblue',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  darkHeading: {
    color: 'rgb(0, 157, 255)',
  },
  darkText: {
    color: '#fff',
  },
  newUpdatesText: {
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row', 
  },
  input: {
    flex: 1, 
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff', 
    paddingHorizontal: 10,
  },
  darkInput: {
    backgroundColor: 'rgb(0, 0, 33)',
    color: '#fff',
    borderColor: '#777',
  },
  sendButton: {
    backgroundColor: 'rgb(0, 157, 255)',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'rgb(0,0,33)',
    fontWeight: 'bold',
  },
  logo: {
    borderColor: 'red',
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logoText: {
    fontSize: 24,
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default Chatbot;
