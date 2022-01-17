import  React, { useState, useEffect, useRef, useCallback } from 'react';
import MapView, { Marker, Circle, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Button, PixelRatio, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import MapViewDirections from 'react-native-maps-directions'

import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import {Ionicons} from '@expo/vector-icons';
import {connect} from 'react-redux'
import { setImageUri } from '../../redux/snapshot-reducer/snapshot.actions';
import momment from 'moment'
import AccelerometerComps from '../../components/Accelerometer/accelerometer.component';
import DataSet from '../../components/Accelerometer/dataset.component';
import styles from './map.styles';
import CustomMarkerView from '../../components/Custom-marker/custom-marker.component';
import { captureRef } from 'react-native-view-shot';
import axios from 'axios';
import { selectCordinates } from '../../redux/coordinates/coordinates.selectors';
import { selectAnomalyType, selectLoadingState } from '../../redux/anomaly/anomaly.selectors';
import { setLoading } from '../../redux/anomaly/anomaly.actions';
import {deleteCords} from '../../redux/coordinates/coordinate.actions'
import { setStart } from '../../redux/start/start.action';



//console.log(momment().startOf('seconds').fromNow())
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let number = 0;


const Map = ({setUri, anomalyState, longLat, route, coordState, setLoading, setToggleStart, deleteC}) => {
  const [NAV_long, setNavLong] = useState(8.170202073330968)
  const [NAV_lat, setNavLat] = useState(4.263939828656528)


  const {  anomaly } = anomalyState

  const coordinates = coordState


  // console.log(coordinates, 'cords')


    const [camera, setCamera] = useState(false)
  let longitude;
  let latitude;

  const [response, setResponse] = useState('')
  const [cameraReady, setCameraReady] = useState(false)
  const [hasPermission, setHasPermission] = useState(null);
  const [long, setLong] = useState('')
  const [lat, setLat] = useState('')
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    longitude: long || 4.262868984974561,
    latitude: lat || 8.170324613161208, 
    longitudeDelta: 0.0004,
    latitudeDelta: 0.005
  })
  const [serverData, setServerData] = useState([
    {
      latitude: 8.170202073330968,
      longitude: 4.263939828656528
    }
  ])
  const [refreshing, setRefreshing] = useState(false);
  const [params, setParams] = useState('')
  const [destinationsLong, setDestinationLong] = useState([])


  useEffect(() => {
    ( () => {
      if(route.params){
        const { NAV_latitude , NAV_longitude } = route.params;

        setNavLat(NAV_latitude);
        setNavLong(NAV_longitude) 

        setRegion({
              longitude:NAV_longitude,
              latitude: NAV_latitude,
              longitudeDelta: 0.0004,
              latitudeDelta: 0.005
            })
      }
     
    })()
  }, [route])



  const [X, setX] = useState(0.000)
  const [Y, setY] = useState(0.000)
  const [pictureTaken, setPictureTaken] = useState(false)

  const [display, setDisplay] = useState(false)

//   const cords = {
//     GPS_latitude: 8.170202073330968,
//     GPS_longitude: 4.263939828656528
// }



  const cords = coordState[Number(`${coordState.length - 1}`)] || {
    GPS_latitude: 7.175240875549053,
    GPS_longitude: 3.337567394095194, 
}

useEffect(() => {
  ( async () => {
    const response = await axios.post("https://road-backend.herokuapp.com/cordinates", cords)
    .then(data => data)
  })()
},[coordState.length])






  const ref = useRef(null)
  const snapRef = useRef(null)

  const targetPixelCount = 1080;
  const pixelRatio = PixelRatio.get()


  const pixels = targetPixelCount /  pixelRatio

  const snapShot = async () => {
    await captureRef(snapRef.current, {
      format: 'png',
      height: pixels,
      width: pixels,
      quality: 1,
      result: 'tmpfile'
    }).then(data => setUri({
                          uri: data,
                          time: momment().startOf('seconds').fromNow(),
                          id: Math.random(),
                          adminArea5:  adminArea5, 
                          adminArea3: adminArea3,
                          adminArea3Type: adminArea3Type, 
                          adminArea1: adminArea1,
                          longitude: GPS_longitude,
                          latitude: GPS_latitude
                      }))
  }



  //TAKE A SCREENSHOT OF THE APP AFTER 6 SECONDS IF USERS DONOT TAKE ANOMALY PHOTO

  setTimeout(() => {
    if(coordinates.length && (pictureTaken === false)){
      snapShot
    }
  }, 6000)
  
  


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const { cameraStatus } = await Camera.requestPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');


      if (hasPermission === null) {
        return <View />;
      }

      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

      // let location = await Location.getCurrentPositionAsync();

      // let pos = await Location.getLastKnownPositionAsync({
      //   maxAge: 10000,
      //   requiredAccuracy: 1
      // })

      // console.log(pos, 'pop')

      // let watchPosition = await Location.watchPositionAsync({
      //     accuracy: 1,
      //     timeInterval: 1000
      // }, (response) => {
      //     const { longitude, latitude } = response.coords
      //     setLong(longitude)
      //     setLat(latitude)
      // })

      // setLocation(location);
    })();
  }, []);

  const [pos, setPos] = useState(null)
  let arrPoc = [];
  useEffect(() => {
    (async () => {
      let posLoc = await Location.getCurrentPositionAsync()
      if(typeof pos !== null){
        setPos(posLoc);
        arrPoc.push({longitude: posLoc.coords.longitude, 
                    latitude: posLoc.coords.latitude})
                   
      } 
    })()
  }, [anomaly, coordState.length])

  

  
  useEffect(() => {
    (async () => {
      
      let watchPosition = await Location.watchPositionAsync({
          accuracy: 1,
          timeInterval: 1000
      }, (response) => {
          const { longitude, latitude } = response.coords
          setRegion({
            longitude: response.coords.longitude,
            latitude: response.coords.latitude,
            longitudeDelta: 0.0004,
            latitudeDelta: 0.005
          })
      })
    })()
  }, [])
  let text = 'Waiting..';
  
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);

    longitude = JSON.parse(text).coords.longitude
    latitude = JSON.parse(text).coords.latitude
    
  }

  const onRegionChange = (region) => {
      setRegion(region)
  } 

  const { GPS_latitude, GPS_longitude } = cords
       


  //IMAGE UPLOAD PROCESS
  let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dquiwka6j/upload';


 useEffect(() => {
   ( () => {

      setParams({
        key: 'Oy2ksiLTnDOLl1Lq96i38mh5ReGxOsHA',
        location:   `${GPS_latitude}, ${GPS_longitude}`,
        includeRoadMetadata: true,
        includeNearestIntersection: true
    })

   })()
 }, [coordState.length])
  
  
  const _takePhoto = async () => {


      const photo = await ref.current.takePictureAsync({base64: true})

      const { uri, base64 } = photo;

      setPictureTaken(true)
      setCamera(!camera)


      await axios.get('http://www.mapquestapi.com/geocoding/v1/reverse', { params })
      .then(res => {
          setResponse(res.data.results.pop().locations.pop())
      })
      .catch( e => {
          console.log(e)
   })

      const { adminArea5, adminArea3, adminArea3Type, adminArea1 } = response;
      console.log(adminArea5, adminArea3, adminArea3Type, adminArea1, 'q')

      

      setRegion({
        longitude:GPS_longitude,
        latitude: GPS_latitude,
        longitudeDelta: 0.0004,
        latitudeDelta: 0.005
      })

      number = number+=1

      let base64Img = `data:image/jpg;base64,${base64}`;

      let data = {
        "file": base64Img,
        "upload_preset": "project",
      }

      await fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        let data = await r.json()

        let date = new Date()


       console.log(data.url, '===============clouudinatyimage===================');
        const request = {
            uri : data.url,
            // time: momment().startOf('seconds').fromNow(),
           // id: Math.random(),
            time: date.toDateString(),
            adminArea5:  adminArea5, 
            adminArea3: adminArea3,
            adminArea3Type: adminArea3Type, 
            adminArea1: adminArea1,
            longitude: GPS_longitude,
            latitude: GPS_latitude
        }

       


       await axios.post("https://road-backend.herokuapp.com/cordinates/uri", request)
      
      
      }).catch(err => console.log(err))

     
  }


  //API FOR FETCHING USER LOCATION





// useEffect(() => {
//     ( async() => {
//         const data = await axios.get('http://www.mapquestapi.com/geocoding/v1/reverse', { params })
//                 .then(res => {
//                     setResponse(res.data.results.pop().locations.pop())
//                     // console.log(res.data.results.pop().locations.pop())
//                 })
//                 .catch( e => {
//                     console.log(e)
//              })
           
//     })()
// }, [pictureTaken])



const onRefresh = useCallback(() => {
  setRefreshing(true);
  wait(3000).then(() => {
      number = number+=1
      setRefreshing(false)
    });
}, []);
 

  useEffect(() => {
    (async () => {
        const response = await axios.get("https://road-backend.herokuapp.com/cordinates").then(res =>{
          return res.data
        }).catch( e => {
          console.log(e)
        })

        setServerData(response)
    })()
  }, [coordState.length, number])

  const _onRegionChange = (region) => {
      
      setRegion(region)
    }


const GOOGLE_MAPS_APIKEY = 'AIzaSyDo13cRrGAY3R_ooRR6CsIhDF1NTn1LBuM'


  return (

    <View style={styles.container}>
        
        <MapView
              provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                ref={snapRef} 
                // onRegionChange={_onRegionChange}
            >
              {
                // serverData.length ? 
                // serverData.map((marker, idx) => (
                  arrPoc.length ?
                  arrPoc.map((marker, idx) => (
                  <Marker 
                  coordinate = {{
                    longitude:  4.26402765714399,
                    latitude:  8.17039899741323
                  }}
                  key={idx}
                    pinColor ={`${anomaly === 'pothole' ? 'red': 'green'}`}
                    title={`${anomaly === 'speed bump' ? 'Pothole': 'Speed Bump'}`}
                    description={"Road Anomaly"}
                  
                  />
                )) :
                null
              }
                <Circle 
                    center={region}
                    radius={10}
                    strokeColor={"#484848"}
                    strokeWidth={5}
                    fillColor={"hotpink"}
                    zIndex={1}
                />
                
                <MapViewDirections
                    // origin={region}
                    lineDashPattern={[0]}
                    origin={{
                      longitude: pos ? pos.coords.longitude : 4.270701516880141,
                      latitude: pos ? pos.coords.latitude : 8.159274276285261,
                  }}
                    // destination={{ latitude: 8.159274276285261,  longitude:  4.270701516880141 }}
                    destination={region}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={6}
                    strokeColor="hotpink"
                  />
                  <Circle 
                    center={{
                        longitude:  pos ? pos.coords.longitude : 4.270701516880141,
                        latitude: pos ? pos.coords.latitude : 8.159274276285261,
                    }}
                    radius={5}
                    strokeColor={"#484848"}
                    strokeWidth={5}
                    fillColor={"#fff"}
                    zIndex={1}
                />
                
            </MapView>

      <DataSet />


     {
         camera ? 
         <Camera 
            ref={ref}
            style={styles.camera}
            //onCameraReady={() => {setCameraReady(!cameraReady); console.log(cameraReady)}} 
            type={Camera.Constants.Type.back}
        >
            <Text>Pictures</Text>
            <TouchableOpacity 
               style={{
                   flex: 1,
                   justifyContent: 'flex-end',
                   alignItems: 'center'
               }}
                onPress={_takePhoto}
                // setToggleStart(true)
            >
                <View  style={{
                    marginTop: 50,
                    backgroundColor: 'red',
                    height: 40,
                    width: 100,
                    
                }}>
                
                 <Text style={{fontWeight: 'bold', marginTop: 10, marginLeft: 20,  color: 'white'}}>SnapShot</Text>
                    
                </View>
            </TouchableOpacity>
        </Camera> :
        null
     }
      
     
     <CustomMarkerView camera={camera} setCamera={setCamera}  /> 
    <ActivityIndicator animating={setLoading.loading} style={styles.marker} size={25} color='green' /> 
    

      {/* <AccelerometerComps setDisplay={setDisplay} setX={setX} X={X} setY={setY} Y={Y} /> */}
    </View>

    
  );
}

const mapStateToProps = state => ({
  anomalyState: selectAnomalyType(state),
  coordState: selectCordinates(state),
  setLoading: selectLoadingState(state)
})

const mapDispatchToProps = dispatch => ({
    setUri: uri => dispatch(setImageUri(uri)),
    deleteC: coords => dispatch(deleteCords(coords)),
    setToggleStart: start => dispatch(setStart(start))

})

export default connect(mapStateToProps, mapDispatchToProps)(Map)

