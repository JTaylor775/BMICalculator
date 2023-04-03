import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const keyHeight = '@MyApp:keyHeight';
const keyBMI = '@MyApp:keyBMI';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);


export default class App extends Component {
  state = {
    height: 0,
    weight: 0,
    BMI: 0,
  };


  
  constructor(props) {
    super(props);
    this.onLoadHeight();
    this.onLoadBMI();
  }

  onLoadHeight = async () => {
    try {
      const storedHeight = await AsyncStorage.getItem(keyHeight);
      this.setState({ storedHeight });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onLoadBMI = async () => {
    try {
      const storedBMI = await AsyncStorage.getItem(keyBMI);
      this.setState({ storedBMI });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {

  }

  onChange = (text) => {
    this.setState({ inputValue: text });
  }

  onComputePress = async () => {
    const { storedHeight, storedWeight, storedBMI } = this.state;
    const BMI = ((storedWeight / (storedHeight * storedHeight)) * 703).toFixed(1);
    this.setState({ storedBMI: BMI });
    try {
      await AsyncStorage.setItem(keyHeight, this.state.storedHeight.toString());
      await AsyncStorage.setItem(keyBMI, this.state.storedBMI.toString());
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  };


  onSetWeight = (weight) => {
    this.setState({ storedWeight: weight});
  }

  onSetHeight = (height) => {
    this.setState({ storedHeight: height});
  }

  render() {
    const { storedWeight, storedHeight, storedBMI } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
        <View>
        <TextInput
          style={styles.input}
          onChangeText={this.onSetWeight}
          value={storedWeight}
          placeholder="Weight in Pounds"/>

          <TextInput style={styles.input}
            placeholder="Height in inches"
            onChangeText={this.onSetHeight}
            value={storedHeight}/>
          <Pressable
          onPress={this.onComputePress}
          >
          {({ pressed }) => (
            <Text style={styles.button}>Compute BMI</Text>
          )}
        </Pressable>
        {  storedBMI > 0 ? <Text style={styles.display}>Body Mass Index is {storedBMI}</Text> : <Text></Text>}
        </View>
        <View>
        <Text style={styles.assessment}>
          Assessing Your BMI{'\n'} 
          {'\t'}Underweight: less than 18.5{'\n'}
          {'\t'}Healthy: 18.5 to 24.9{'\n'}
          {'\t'}Overweight: 25.0 to 29.9{'\n'}
          {'\t'}Obese: 30.0 or higher{'\n'}
        </Text>
        </View>
        </ScrollView>
</SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    fontSize: 28,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 10,
  },
  preview: {
    backgroundColor: '#bdc3c7',
    flex: 1,
    height: 500,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    flex: 1,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  display: {
    fontSize: 28,
    textAlign: 'center',
    paddingTop: 25
  },
  assessment: {
    fontSize: 20,
    paddingTop: 100
  }
});