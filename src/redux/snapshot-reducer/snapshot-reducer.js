import coordinateUtils from '../coordinates/coordinate.utils';

const INITIAL_STATE = {
    uri: []
}

const snapshotReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'SET_IMAGE_URI':
            return {
                ...state,
                uri: coordinateUtils(state.uri, action.payload)
            }  
        
        default: {
            return state
        }
    }
}

export default snapshotReducer