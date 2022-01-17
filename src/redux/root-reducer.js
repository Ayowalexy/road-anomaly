import { combineReducers } from 'redux';
import snapshotReducer from './snapshot-reducer/snapshot-reducer';
import { persistReducer } from 'redux-persist';
import anomalyReducer from './anomaly/anomaly-reducer';
import coordinateReducer from './coordinates/coordinates.reducer';
import startReducer from './start/start.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['uri', 'anomaly', 'coord']
}


const rootReducer = combineReducers({
    uri: snapshotReducer,
    anomaly: anomalyReducer,
    coord: coordinateReducer,
    start: startReducer
})

export default persistReducer(persistConfig, rootReducer)