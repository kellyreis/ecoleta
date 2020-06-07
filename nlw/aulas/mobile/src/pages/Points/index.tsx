import React, { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Constants from 'expo-constants'
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg'
import api from '../../services/api';
import * as Location from 'expo-location';

interface Item {
  id: number;
  title: string,
  image_url: string,

}
interface Point {
  id: number;
  nome: string,
  image: string,
  image_url: string,
  latitude: number,
  longitude: number,
}

interface Params {
  uf: string;
  city: string;
}


const Points = () => {
  const [initialPosition, setinitialPosition] = useState<number, number>([-22.4550367, -47.576667]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setselectedItems] = useState<number[]>([]);
  const [points, setpoints] = useState<Point[]>([]);
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {

    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setinitialPosition({
        latitude,
        longitude
      })

    }
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);


  useEffect(() => {
    api.get('points',
      {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems
        }
      }
    ).then(response => {
      setpoints(response.data);
    });
  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }

  function handleSelectItem(id: number) {

    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setselectedItems(filteredItems);
    }
    else {
      setselectedItems([

        ...selectedItems, id
      ]);
    }

  }


  return (

    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title} >Bem Vindo.</Text>
        <Text style={styles.description} >Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {
            initialPosition[0] !== 0 && (
              <MapView style={styles.map}

                initialRegion={{
                  latitude: initialPosition[0],
                  longitude: initialPosition[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014,
                }}
              >
                {
                  points.map(point => (
                    <Marker
                      onPress={() => handleNavigateToDetail(point.id)}
                      key={String(point.id)}
                      styles={styles.mapMarker}
                      coordinate={{
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }}

                    >
                      <View styles={styles.mapMarkerContainer}>
                        <Image

                          style={styles.mapMarkerImage}
                          source={{

                            uri: point.image_url

                          }} />
                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                      </View>
                    </Marker>
                  ))
                }

              </MapView>
            )
          }
        </View>
      </View>

      <View style={styles.itemsContainer}>

        <ScrollView horizontal
          showHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {
            items.map(item => (
              <TouchableOpacity
                key={String(item.id)}
                style={[styles.item,

                selectedItems.includes(item.id) ?
                  styles.selectedItem : {}]}
                onPress={() => handleSelectItem(item.id)} >
                <SvgUri width={42} height={42}
                  uri={item.image_url}
                  activeOpacity={0.6}
                />

                <Text style={styles.itemTitle} >{item.title}</Text>

              </TouchableOpacity>
            ))
          }


        </ScrollView>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
    
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
    backgroundColor: '#34CB79',
    paddingHorizontal:20,
    paddingTop:10,
    paddingBottom:10,
    borderRadius:10,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;