import React, {useEffect, useState, useCallback} from 'react'
import { View, Text, RefreshControl, useWindowDimensions, StatusBar, ImageBackground, FlatList, ScrollView } from 'react-native'
import Anomaly from '../anomaly/anomaly.component'
import {connect} from 'react-redux'
import axios from 'axios'
import { selectSnapShotUri } from '../../redux/snapshot-reducer/snapshot.selector';
import { selectAnomalyType } from '../../redux/anomaly/anomaly.selectors';
import { selectCordinates } from '../../redux/coordinates/coordinates.selectors';

const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

let number = 0;

const Logs = ({ anomaly, navigation, coordState}) => {

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      wait(3000).then(() => {
          number = number+=1
          setRefreshing(false)
        });
    }, []);

    const [uri, setUri] = useState([])

    const [response, setResponse] = useState('')


   useEffect(() => {
       ( async () => {
            await axios.get("https://road-backend.herokuapp.com/cordinates/uri")
                            .then(response => setUri(response.data))
       })()
   }, [number])
    
    const { coordinates } = anomaly

    const { width } = useWindowDimensions()
    return (
        <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{marginBottom: 20}}>
            <View style={{
                marginTop: StatusBar.currentHeight,
                width,
                backgroundColor: 'white',
                height: 50
            }}>
                <Text style={{textAlign: 'center', fontSize: 18, paddingTop: 5, fontWeight: 'bold'}}>Logs</Text>
            </View>

            <View>
                <ImageBackground source={require('../../assets/1.png')} style={{
                    width: width,
                    height: 220,
                    backgroundColor: '#FF2EEA'
                }}>
                    <View style={{
                        width: 200,
                        backgroundColor: 'white',
                        height: 50, borderRadius: 10,
                        marginTop: 85,
                        marginLeft: (width - 200) / 2
                    }}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 15, paddingTop: 12}}>Recent Road Anomaly</Text>
                    </View>
                </ImageBackground>

            </View>
            <Text style={{textAlign: 'center', marginTop: 10, fontSize: 16, fontWeight: 'bold'}}>Pull to Refresh</Text>
            <View style={{marginTop: 10 }}>

                {
                     uri ? 

                     <Anomaly navigation={navigation} item={uri} />
                     
                        
                         : null
                }
            
            </View>            
        </ScrollView>
    )
}

const mapStateToProps = state => ({
    coordState: selectCordinates(state),
    anomaly: selectAnomalyType(state)
})

export default connect(mapStateToProps)(Logs)