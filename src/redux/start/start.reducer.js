const INITIAL_STATE = {
    start: false
}

const startReducer = (state =INITIAL_STATE, action) => {
    switch(action.type){
        case 'SET_START': 
            return {
                ...state,
                start: action.payload
            }

        default :
         return state
    }
}

export default startReducer