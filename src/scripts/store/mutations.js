import * as mutationTypes from './types/mutations';

export default {
    [mutationTypes.SET_CURRENT_TIME](state, time) {
        state.currentTime = time
    },
}