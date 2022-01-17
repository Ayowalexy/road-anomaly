import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import HomeScreen from '../homescreen/homescreen.component'
import Logs from '../logs/logs.component'
import Map from '../map/map.component'

const Tab = createMaterialTopTabNavigator()

const TabNavigator = () => (
    <Tab.Navigator
    initialRouteName='HomeScreen'
        screenOptions={{
            tabBarStyle: {
                height: 0
            }
        }}
    >
        <Tab.Screen name='Map' component={Map} />
        <Tab.Screen name='HomeScreen' component={HomeScreen} />
        <Tab.Screen name='Logs' component={Logs} />
    </Tab.Navigator>
)

export default TabNavigator