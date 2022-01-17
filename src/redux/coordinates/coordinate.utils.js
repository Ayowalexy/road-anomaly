const coordinateUtils = (oldState, newState) => {
    let arr = []
     oldState ? arr.push(...oldState) : null

    arr.push(newState)
   
    return arr
}

export default coordinateUtils