import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';


const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
class BService {
  constructor() {
    this.Options = {
      taskName: 'Example',
      taskTitle: 'ExampleTask title',
      taskDesc: 'ExampleTask description',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
      parameters: {
        delay: 1000,
      },
    };


  }
  VeryIntensiveTask = async (taskDataArguments) => {
    try {
      // Example of an infinite loop task
      const { delay } = taskDataArguments;
      await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          Geolocation.getCurrentPosition(
            (position) => {
              AsyncStorage.getItem('gps_data')
                .then(data => {
                  if (data == null) {
                    data = [];
                  }
                  try {
                    data = JSON.parse(data);
                  } catch (error) {
                    data = [];
                  }
                  data.unshift({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    speed: position.coords.speed,
                  })
                  AsyncStorage.setItem('gps_data', JSON.stringify(data, null, 2))
                })
            },
            (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );


          await sleep(delay);
        }
      });
    } catch (error) {
      console.log(error)
    }
  };
  Start() {
    BackgroundService.start(this.VeryIntensiveTask, this.Options);
  }
  Stop() {
    BackgroundService.stop();
  }
}
const BackgroudService = new BService();
export default BackgroudService;