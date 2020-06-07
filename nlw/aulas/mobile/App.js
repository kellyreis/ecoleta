import React from 'react';
import {AppLoading} from 'expo';
import { StyleSheet, Text, View , StatusBar} from 'react-native';
import Routes from './src/routes';
import {Ubuntu_700Bold} from '@expo-google-fonts/ubuntu';

import {Roboto_400Regular, Roboto_500Medium, useFonts} from '@expo-google-fonts/roboto';
export default function App() {



const [fontsLoaded] = useFonts({
  Roboto_400Regular,
  Roboto_500Medium,
  Ubuntu_700Bold,
})

if(!fontsLoaded){
  return <AppLoading />
}
  return (
    <>
      <StatusBar barStyle="dark-context" 
      backgroundColor="transparent"
      translucent
      />
      <Routes />
    </>

  );
}
