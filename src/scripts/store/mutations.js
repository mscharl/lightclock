import * as mutationTypes from './types/mutations';

export default {
    [mutationTypes.SET_CURRENT_TIME](state, time) {
        state.currentTime = {
            year   : time.years,
            month  : time.months,
            date   : time.date,
            hours  : time.hours,
            minutes: time.minutes,
        }
    },
}