import React, { Component, useState , useEffect} from 'react';
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
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const keyHeight = '@MyApp:keyHeight';
const keyBMI = '@MyApp:keyBMI';

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const bmiDB = SQLite.openDatabase("bmiDB.db");
  return bmiDB;
}

const bmiDB = openDatabase();

function Calculations({ }) {
  const [calculations, setCalculations] = useState(null);

  useEffect(() => {
    bmiDB.transaction((tx) => {
      tx.executeSql(
        `select id, height, weight, bmi, date(calculationDate) from calculations 
         order by calculationDate desc;`,
        [],
        (_, { rows: { _array } }) => setCalculations(_array)
      );
    });
  }, []);

  if (calculations === null || calculations.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>BMI History</Text>
      {calculations.map(({ id, bmi, height, weight, calculationDate }) => (
        <Text key={id} style={styles.display}>{calculationDate}: {bmi} (W: {weight}, H: {height})</Text>
      ))}
    </View>
  );
}


export default function App() {

  const [bmi, setBMI] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);

  useEffect(() => {
    bmiDB.transaction((tx) => {
      tx.executeSql(
        "create table if not exists calculations (id integer primary key not null, height text, weight text, calculationDate real, bmi text);"
      );
    });
  }, []);

  const add = () => {
    // is text empty?
    if (height === null || height === "" || weight === null || weight === "") {
      return false;
    } else {
      setHeight(height);
      setWeight(weight);
    }

    bmi = calcBMI();

    if (bmi === "" || bmi === null) {
     return false; 
    }

    bmiDB.transaction(
      (tx) => {
        tx.executeSql("insert into calculations (bmi, height, weight, calculationDate) values ("[bmi], [height], [weight], julinday('now'));
        tx.executeSql("select * from calculations order by calculationDate desc;",
         [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
    );
  };

  onChange = (text) => {
    this.setState({ inputValue: text });
  }

  calcBMI = () => {
    const bmi = (parseFloat(weight / (height * height)) * 703).toFixed(1);
    console.log("calc");
    setBMI(bmi);
    return bmi
   };

  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
        <View>
        <TextInput
          style={styles.input}
          // onChangeText={(weight) => setWeight(weight)}
          value={weight}
          placeholder="Weight in Pounds"/>
          <TextInput style={styles.input}
          // onChangeText={(height) => setHeight(height)}
          value={height}
            placeholder="Height in inches"/>
          <Pressable
          onPress={add()}
          >
          {({ pressed }) => (
            <Text style={styles.button}>Compute BMI</Text>
          )}
        </Pressable>
        <View>
        {  bmi > 0 ? <Text style={styles.display}>Body Mass Index is {bmi}</Text> : <Text></Text>}
        {  bmi > 0 && bmi < 18.5 ? <Text style={styles.display}>(Underweight)</Text> : <Text></Text>}
        {  bmi > 18.5 && bmi < 24.9 ? <Text style={styles.display}>(Healthy)</Text> : <Text></Text>}
        {  bmi > 25.0 && bmi < 29.9 ? <Text style={styles.display}>(Overweight)</Text> : <Text></Text>}
        {  bmi > 30.0 ? <Text style={styles.display}>(Obese)</Text> : <Text></Text>}
        </View>
        </View>
        </ScrollView>
</SafeAreaView>
    );
  };


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
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 25
  },
  assessment: {
    fontSize: 20,
    paddingTop: 100
  }
});