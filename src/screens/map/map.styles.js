import { StyleSheet, Dimensions } from 'react-native'



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      marginBottom: -400
    },
  
    marker: {
      flex: 1, 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: 400,
      position: 'absolute',
      top: Dimensions.get('window').height - 50
      },
      camera: {
          flex: 1,
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').width,
          position: 'absolute',
          top: 0
      }
  });

  export default styles