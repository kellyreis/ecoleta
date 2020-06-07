import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Picker, Platform, KeyboardAvoidingView, TextInput, ImageBackground, View, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}
const Home = () => {

  const navigation = useNavigation();
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUF, setSelectedUf] = useState('0');
  const [citys, setCitys] = useState<string[]>([]);
  const [selectedCity, setselectedCity] = useState('0');

  const uf = selectedUF;
  const city = selectedCity;

  function handleNavigationPoints() {
    navigation.navigate('Points', {
      uf,
      city,
    });
  }



  useEffect(() => {

    //Pega APi do Ibge Estados
    Axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);

    });
  }, []);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setUfs(uf);
  }

  useEffect(() => {
    //Carregar as cidades sempre que a UF mudar
    if (selectedUF === '0') {
      return;
    }
    Axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCitys(cityNames);

      });

  }, [selectedUF]);

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setselectedCity(city);
  }


  return (

    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{
          width: 574, height: 368
        }}

      >

        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Picker
            selectedValue={selectedUF}
            style={styles.select}
            onValueChange={(selectedUF, itemIndex) => setSelectedUf(selectedUF)}
            onChange={handleSelectUf}
          >
            <Picker.Item label="Selecione um Estado (UF)" value="0" />
            {ufs.map(uf => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>


          <Picker
            selectedValue={selectedCity}
            style={styles.select}
            onValueChange={(itemValue, itemIndex) => setselectedCity(itemValue)}
            onChange={handleSelectCity}
          >
            <Picker.Item label="Selecione uma cidade" value="0" />
            {citys.map(city => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>

          <RectButton style={styles.button} onPress={handleNavigationPoints}>
            <View style={styles.buttonIcon}>
              <Text style={styles.buttonText}>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#6C6C80',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;