import React, { useState, useEffect, useRef} from 'react';
import * as Location from 'expo-location';
import { View, Text } from 'react-native'
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import { connect } from 'react-redux'
import { setAnomaly, setLoading } from '../../redux/anomaly/anomaly.actions';
import Notify from '../../screens/map/notification';
import { setCordinates, deleteCords } from '../../redux/coordinates/coordinate.actions';



const { StorageAccessFramework } = FileSystem
let prev;
let arr = [];


const DataSet = ({anomalyType, setLongLat, setLoading, toggleStart}) => {
    const [camera, setCamera] = useState(false)
    let lgd;
    let ltd;
  
   const [res, setResponse] = useState('')
    const [hasPermission, setHasPermission] = useState(null);
    const [long, setLong] = useState('')
    const [lat, setLat] = useState('')
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
      });
    const [gyroscope, setGyroscope] = useState({
        x: 0,
        y: 0,
        z: 0,
      });
      const [subscription, setSubscription] = useState(null);
      const [gSubscription, setGSubscription] = useState(null)
      const [serverRes, setServerRes] = useState(null)
   
  
    const ref = useRef(null)
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }


        let location = await Location.getCurrentPositionAsync({});
  
        await Location.watchPositionAsync({
            accuracy: 1,
            timeInterval: 1000
        }, (response) => {
            // console.log(response)
            setResponse(response)
            const { longitude, latitude } = response.coords
            setLong(longitude)
            setLat(latitude)
        })
  
        setLocation(location);
      })();
    }, []);
  
    let text = 'Waiting..';
    // let coords;
    // let timestamp;
    let obj = ''
    
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);

      const { coords, timestamp } = JSON.parse(text)

      const { altitude, heading, latitude, longitude, speed } = coords

      const { x, y, z } = data;
      const Gx = gyroscope.x;
      const Gy = gyroscope.y;
      const Gz = gyroscope.z;
 

     obj = {
      gyroscope_x: `${Gx.toString()}`,
      gyroscope_y: `${Gy.toString()}`,
      gyroscope_z: `${Gz.toString()}`,
      acceleration_x: `${x.toString()}`,
      acceleration_y: `${y.toString()}`,
      acceleration_z: `${z.toString()}`,
      GPS_latitude: `${latitude.toString()}`,
      GPS_longitude: `${longitude.toString()}`
      
    }
      // timestamp  = JSON.parse(text).timestamp
      // coords  = JSON.parse(text).coords

  
      lgd = JSON.parse(text).coords.longitude
      ltd = JSON.parse(text).coords.latitude
      
    }
    
      const _slow = () => {
        Accelerometer.setUpdateInterval(1000);
        Gyroscope.setUpdateInterval(1000);
      };
      Accelerometer.setUpdateInterval(500);
      const _fast = () => {
        Accelerometer.setUpdateInterval(16);
        Gyroscope.setUpdateInterval(500);
      };
    
      const _subscribe = () => {
        setSubscription(
          Accelerometer.addListener(accelerometerData => {
            setData(accelerometerData);
          })
        );

          setGSubscription(
            Gyroscope.addListener(gyroscopeData => {
              setGyroscope(gyroscopeData);
            })
          )

      };
    
     
     

      const _unsubscribe = () => {
        subscription && subscription.remove();
        gSubscription && gSubscription.remove();
        setSubscription(null);
        setGSubscription(null);
      };
    
      useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
      }, []);
    
     
   
      const { x, y, z } = data;
      const Gx = gyroscope.x;
      const Gy = gyroscope.y;
      const Gz = gyroscope.z;
    


    // console.log(JSON.stringify(obj), ',')

     
      let sqrt = Math.sqrt( (x * x) + (y * y) + (z * z)).toFixed(2)
      // prev = sqrt
      let change = Math.abs(sqrt - 0.98).toFixed(2)
      const gry = Format(Gx, Gy, Gz)

        // console.log(sqrt)
   
      // if(change > 1.5){
      if(gry > 0.4){
        arr.push(JSON.stringify(obj))
        
      }
      
      let initialRender = useRef(true)


      useEffect(() => {
        if(initialRender.current){
          initialRender.current = false
        } else {

       
              (async () => {
                
                if(toggleStart){
                                  //CALL THE NOTIFY FUNCTION TO NOTIFY THE USER THAT AN ANOMALY WAS DETECTED
                Notify(response)

                //SEND SERVERREQUEST JSON OBJECT TO THE SERVER TO VERIFY THE TYPE OF ANOMALY
                const serverRequest = arr.slice(0, 1).pop();
                  
                console.log(serverRequest, '===================serverrequest===================')

                
                  const parsed = JSON.parse(serverRequest)

                    const { GPS_latitude, GPS_longitude } = parsed


                    setLoading(true)
                      //deleteC()

                      let example = {"gyroscope_x":"1.6904702186584473","gyroscope_y":"1.5008114576339722","gyroscope_z":"0.634222149848938","acceleration_x":"0.6994233727455139","acceleration_y":"0.503841757774353","acceleration_z":"-2.5272645950317383"}

                 
                    const response = await axios.post('https://road-anomaly.herokuapp.com/api/anomaly', serverRequest,
                    {
                      headers:
                        {"Content-Type" : "application/json"}
                    }).then(response => {
                      return response.data
                    }).catch( e => {
                      console.log(e)
                    })
              
                      console.log(response)

                    

                      setLongLat({GPS_latitude: Number(GPS_latitude), GPS_longitude: Number(GPS_longitude)})

                      anomalyType(response)

                      //setLongLat({GPS_latitude: 7.166883440124041,  GPS_longitude: 3.3417705905562696})
                    
                }


              })()
         }

       
      }, [arr.length])
     
     
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginTop: 60, flexDirection:'row'}}>
        </View>

    )
}

const Format = (x, y, z) => {
  let sqrt = Math.abs(Math.sqrt( (x * x) + (y * y) + (z * z))).toFixed(2);
   return sqrt
}

const mapStateToProps = state => ({
  toggleStart: state.start.start
})

const mapDispatchToProps = dispatch => ({
  anomalyType: anomaly => dispatch(setAnomaly(anomaly)),
  setLongLat: coords => dispatch(setCordinates(coords)),
  setLoading: load => dispatch(setLoading(load)),
  deleteC: coords => dispatch(deleteCords(coords))
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSet)