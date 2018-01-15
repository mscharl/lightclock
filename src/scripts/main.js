import Vue from 'vue'
import App from './App.vue'

import * as actionTypes from './store/types/actions'
import store from './store';

new Vue({
    name: 'Lightclock',

    el    : '#app',
    render: h => h(App),

    store,

    mounted() {
        store.dispatch(actionTypes.CONTINUOUSLY_SET_CURRENT_TIME);
    },
});
