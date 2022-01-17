import { createSelector } from 'reselect'

const selectSnapShot = state => state.uri

export const selectSnapShotUri = createSelector(
    [selectSnapShot],
    (snapShot) => snapShot.uri
)