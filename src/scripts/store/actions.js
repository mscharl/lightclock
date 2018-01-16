import * as actionTypes from './types/actions'
import * as mutationTypes from './types/mutations'

let CONTINUOUS_TIME_SETTER_INTERVAL = null;

export default {
    [actionTypes.CONTINUOUSLY_SET_CURRENT_TIME](context) {
        const setTimeRequest = () => window.requestAnimationFrame(setTime);
        const setTime        = () => {
            const now     = new Date();
            const utcDate = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());

            context.commit(mutationTypes.SET_CURRENT_TIME, utcDate);
            CONTINUOUS_TIME_SETTER_INTERVAL = window.setTimeout(setTimeRequest, 5000);
        };

        context.dispatch(actionTypes.STOP_CONTINUOUSLY_SET_CURRENT_TIME)
               .then(setTime);
    },

    [actionTypes.STOP_CONTINUOUSLY_SET_CURRENT_TIME](context) {
        window.clearInterval(CONTINUOUS_TIME_SETTER_INTERVAL);
    },
}