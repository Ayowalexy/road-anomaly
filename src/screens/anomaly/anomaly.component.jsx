import React from 'react'
import { View, Text, ImageBackground, Pressable, Dimensions } from 'react-native'
import moment from 'moment';


const arr = [1, 2,3 ]
const Anomaly = ({item, navigation}) => {
   return (
       <View style={{flex: 1, flexDirection: 'row',
       flexWrap: 'wrap'}}>
           {
               item.map((element, idx) => (
                        <Pressable
                        key={idx}
                        onPress={() => {
                            navigation.navigate('Map', {
                                NAV_latitude: element.latitude,
                                NAV_longitude: element.longitude
                            })
                        }}
                        
                    >
                        <View style={{ marginLeft: 18}}>
                            <View>
                                <ImageBackground source={{
                                    uri: element["uri"]
                                }}  style={{width: 150,height: 200 }} />
                                <Text style={{fontSize: 13, fontWeight: 'bold', paddingTop: 10, textTransform: 'capitalize'}}>{element.time}</Text>
                                <Text style={{fontSize: 13, fontWeight: 'bold', paddingTop: 10}}>{element.adminArea3 ? `${element.adminArea5}, ${element.adminArea3} ${element.adminArea3Type} ${element.adminArea1}`: null }</Text>
                            </View>
                        </View>
                    </Pressable>
               ))
           }
       </View>
   )
    
                
      
    
   
}

export default Anomaly