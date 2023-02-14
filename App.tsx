import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ToastAndroid,
  Alert,
  PermissionsAndroid,

} from 'react-native';

import BackgroudService from './src/BackTest';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';


function App() {
  const [datastr, setdatastr] = useState('');

  return (
    <SafeAreaView >
      <Button
        title="start"
        onPress={() => {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          )
          .then((granted) => {
            if(granted !== PermissionsAndroid.RESULTS.GRANTED) {
              ToastAndroid.show('지도 권한 거절', ToastAndroid.SHORT);
              return
            }
            BackgroudService.Start();
          })
        }}
      />
      <Button
        title="stop"
        onPress={() => {
          BackgroudService.Stop();
          ToastAndroid.show('정지', ToastAndroid.SHORT);
        }}
      />
      <Button
        title="get gps"
        onPress={() => {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          )
          .then((granted) => {
            if(granted !== PermissionsAndroid.RESULTS.GRANTED) {
              ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
            }
            Geolocation.getCurrentPosition(
              (position) => {
                let data = {
                  latitude : position.coords.latitude,
                  longitude: position.coords.longitude,
                  speed: position.coords.speed,
                }
                setdatastr(JSON.stringify(data, null, 2))
              },
              (error) => {
                console.log(error.code, error.message);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
          })
          
        }}
      />
      <Button
        title="get storage data"
        onPress={() => {
          AsyncStorage.getItem('gps_data')
          .then(data => {
            if(data == null) {
              data = '';
            }
            setdatastr(data);
          })
          
        }}
      />
      <Button
        title="reset storage data"
        onPress={() => {
          AsyncStorage.setItem('gps_data', '')
          .then(() => {
            return AsyncStorage.getItem('gps_data')
          })
          .then(data => {
            if(data == null) {
              data = '';
            }
            setdatastr(data);
          })
        }}
      />
      <Text>{datastr}</Text>
    </SafeAreaView>
  );
}


export default App;

