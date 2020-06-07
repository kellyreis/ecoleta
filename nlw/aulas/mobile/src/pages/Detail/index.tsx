import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants'
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';
interface RouteParams {
  point_id: number;
}
interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;

  },
  items: {
    title: string,
  }[] // declarando um array de objetos
}
const Detail = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const navigation = useNavigation();
  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    })
  }, [])


  function handleNavigateBack() {
    navigation.goBack();
  }
  function handleWhastapp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho Interesse sobre coleta de resíduos`)
  }
  function handleComposerMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],

    });
  }


  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View styles={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Image style={{ resizeMode: 'cover', width: '100%', height: 120 }}
          source={{ uri: data.point.image_url }}
        />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(", ")}

        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button}
          onPress={handleWhastapp}
        >
          <FontAwesome name="whatsapp" size={30} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>

        </RectButton>
        <RectButton style={styles.button}
          onPress={handleComposerMail}
        >
          <Icon name="mail" size={30} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>

        </RectButton>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:46,
    paddingHorizontal:20,
    paddingBottom: 46,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});
export default Detail;