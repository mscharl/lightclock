import * as getterTypes from './types/getters';

export default {


    [getterTypes.CURRENT_TIME](state) {
        return state.currentTime
    },

    [getterTypes.LOCATIONS](state) {
        return state.locations
    },
}