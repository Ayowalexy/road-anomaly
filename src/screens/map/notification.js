import React from 'react'
import * as Notifications from 'expo-notifications';
import { Vibration } from 'react-native';

const Notify = (body) => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });


      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Road Anomaly',
          body: body
        },
        trigger: {
          seconds: 0,
        }
      })

      return Vibration.vibrate()
}

export default Notify