import 'react-native-gesture-handler';
/**
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type, {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


import TabNavigator from './src/screens/tab/tab.component';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'
import{ store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import HomeScreen from './src/screens/homescreen/homescreen.component'
import Logs from './src/screens/logs/logs.component'
import Map from './src/screens/map/map.component'
// console.disableYellowBox = true;



const Stack = createNativeStackNavigator()


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Tabs' component={TabNavigator} options={{headerShown: false}} />
                <Stack.Screen name='MapTab' component={Map} />
                <Stack.Screen name='HomeScreenTab' component={HomeScreen} />
                <Stack.Screen name='LogsTab' component={Logs} />
            </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>  
  )
}
export default App;

