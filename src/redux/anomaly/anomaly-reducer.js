
const INITIAL_STATE = {
    anomaly: null,
    loading: false
}


const anomalyReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'SET_ANOMALY':
            return {
                ...state,
                anomaly: action.payload,
            }

        case 'SET_LOADING': 
            return {
                ...state, 
                loading: action.payload
            }
        
        default: {
            return state
        }
    }

}


export default anomalyReducer