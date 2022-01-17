// import coordinateUtils from '../coordinates/coordinate.utils';
import coordinateUtils from './coordinate.utils';

const INITIAL_STATE = {
    coordinates: []
}

const coordinateReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'SET_COORDINATE':
            return {
                ...state,
                coordinates: coordinateUtils(state.coordinates, action.payload)
            } 

        case 'DELETE_COORDS': 
        return {
            ...state, 
            coordinates : []
        }
        
        default: {
            return state
        }
    }
}

export default coordinateReducer