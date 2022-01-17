import { createSelector } from 'reselect'

const selectAnomaly = state => state.anomaly

export const selectAnomalyType = createSelector(
    [selectAnomaly], 
    (anomaly) => anomaly
)

export const selectLoadingState = createSelector(
    [selectAnomaly], 
    (load) => load
)