import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator, Modal, Dimensions } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import styles from '../../screens/map/map.styles'
import { connect } from 'react-redux'
import { selectAnomalyType, selectLoadingState } from '../../redux/anomaly/anomaly.selectors';
import { setLoading } from '../../redux/anomaly/anomaly.actions';
import { selectCordinates } from '../../redux/coordinates/coordinates.selectors';
import { setStart } from '../../redux/start/start.action'




const CustomMarkerView = ({camera, setCamera, anomalyType, setLoading, coordState, setToggleStart}) => {

  
    const { anomaly } = anomalyType
    const offSetPosition = useRef( new Animated.Value(0)).current
    const [modalVisible, setModalVisible] = useState(false);


    console.log(anomalyType)

    useEffect(() => {
        Animated.timing(offSetPosition, {
            toValue: 0,
            duration: 500, 
            useNativeDriver: true,
        }).start()
    }, [coordState.length])

   
    useEffect(() => {
        setTimeout(() => {
            Animated.timing(offSetPosition, {
                toValue: 100,
                duration: 500, 
                useNativeDriver: true,
            }).start()
        }, 5000)
    }, [coordState.length])

    useEffect(() => {
        (() => {
            setLoading(false)
        })()
    }, [coordState.length])
    

    return (
           
        <View style={[ {
            flex: 1,
            justifyContent: 'flex-end'
            
            
        },]}
        // {opacity: position,, height: anomaly ? 70 : 0}]}
        >
            <Animated.View
               style={{
                   //marginTop: -200,
                   flex: 0.4,
                   borderTopRightRadius: 40,
                   borderTopLeftRadius: 40,
                   justifyContent: 'center',
                   alignItems: 'center',
                   transform: [{
                       translateY: offSetPosition
                   }],
                   backgroundColor: anomaly === 'pothole' ? 'red': 'green',
                   width: Dimensions.get('screen').width,
                   height: 200
               }
            }
            >
            
                    {
                        anomaly ?
                        <View style={{flex: 0.1,
                            
                            justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <View>

                            {
                                anomaly === 'pothole' ?  <Text style={{color: 'white', fontWeight: 'bold'}}>Pothole Detected</Text> : null

                            }
                            {
                                anomaly === 'speed bump' ?  <Text style={{color: 'white', fontWeight: 'bold'}}>Speed Bump</Text> : null

                            }
                            {
                            
                                anomaly === 'Good Road' ?  <Text style={{color: 'white', fontWeight: 'bold'}}>Good Road</Text> : null

                            }
                            </View>
                            <View style={{marginLeft: 20}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setToggleStart(false)
                                        setCamera(!camera)
                                        
                                    }
                                }
                                >
                                    <Ionicons name='camera' size={30} color='white' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        : null
                        }
            </Animated.View>
        </View>
       
    )
}

const mapStateToProps = state => ({
    anomalyType: selectAnomalyType(state),
    load: selectLoadingState(state),
    coordState: selectCordinates(state)
  })

const mapDispatchToProps = dispatch => ({
    setLoading: load => dispatch(setLoading(load)),
    setToggleStart: start => dispatch(setStart(start))
})



export default connect(mapStateToProps, mapDispatchToProps)(CustomMarkerView)