import React, {useRef, useState} from 'react'
import { View, Text, StyleSheet, useWindowDimensions, Animated, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {Ionicons} from '@expo/vector-icons';
import { connect } from 'react-redux'
import { setStart } from '../../redux/start/start.action';



const HomeScreen = ({navigation, toggleStart, setToggleStart}) => {
    const { width } = useWindowDimensions()
    const margin = (width - 170) / 2

    const animated = useRef(new Animated.Value(1)).current

    const _start = () => {
        Animated.loop(Animated.sequence([
            Animated.timing(animated, {
                toValue: 1.2,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(animated, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            })

    ]),

    {iterations: 1000}
).start()
    }
    const _stop = () => {
        Animated.loop(Animated.sequence([
            Animated.timing(animated, {
                toValue: 1.2,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(animated, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            })

    ]),

    {iterations: 1000}
).stop()
    }
    
    return (
        <LinearGradient
                style={styles.container}
                colors={['#94A9EF', '#0F42EE']}
        >
            <View>
                <View style={{
                    flex: 0,
                    marginTop: -300,
                    flexDirection: 'row',
                    width: width,
                    height: 50,
                    justifyContent: 'space-between'
                }}>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Map')
                        }}
                    >
                        <View style={{marginLeft: 15}}>
                            <Ionicons name='md-map' color='white' size={25} />
                            <Text style={styles.text}>Map</Text>
                        </View>
                    </Pressable>

                    <View style={styles.indicatorContainer}>
                        <View style={styles.indicator}></View>
                        <View style={styles.indicator}></View>
                        <View style={styles.indicator}></View>
                    </View>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Logs')
                        }}
                    >
                        <View style={{marginRight: 15}}>
                            <Ionicons name='bar-chart' color='white' size={25} />
                            <Text style={styles.text}>Logs</Text>
                        </View>
                    </Pressable>
                </View>
               <View style={{
                    position: 'absolute',
                    marginLeft: margin,
                    top: -100
               }}>
                   <Animated.View>
                        <Text style={[styles.track, {width: width}]}>Tap to {toggleStart ? 'Stop' : 'Start'} Road Tracking</Text>
                   </Animated.View>
                   <Pressable
                            onPress={() => {

                                setToggleStart(!toggleStart)
                                
                                if(toggleStart){
                                     _start()
                                } else {
                                    _stop()
                                }
                                //navigation.navigate('Map')
                            }}
                        >
                   <Animated.View
                        style={[styles.transform, {transform: [{scale: animated}]}]}
                    >
                       
                                <View style={
                                {padding: 30,
                                
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                flex: 1,
                                }}>
                                    <Ionicons name='car' color='white' size={100} />
                            </View>
                        
                   </Animated.View>
                   </Pressable>
               </View>
            
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    indicatorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: 10
    },
    track: {
        left: -30,
        position: 'absolute', 
        top: -50, 
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    transform: {
        backgroundColor: '#AABBF5',
        width: 170,
        borderRadius: 100,
        height: 170,
                         
    }
})

const mapStateToProps = state => ({
    toggleStart: state.start.start
})

const mapDispatchToProps = dispatch => ({
    setToggleStart: start => dispatch(setStart(start))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)