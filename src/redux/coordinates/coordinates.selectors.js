import { createSelector } from 'reselect'

const selectCords = state => state.coord

export const selectCordinates = createSelector(
    [selectCords],
    (coord) => coord.coordinates
)

