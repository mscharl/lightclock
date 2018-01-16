<template>
    <div class="Location__wrapper" :style="wrapperStyles">
        <article class="Location" :style="balanceStyles">
            {{ location.name }}<br>
            {{ formattedTime }}
        </article>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import 'moment-timezone';

    import * as getterTypes from '../store/types/getters'

    export default {
        name: 'Location',

        props: ['location'],

        computed: {
            ...mapGetters({
                currentUTCTime: getterTypes.CURRENT_TIME,
            }),

            locationTime() {
                return moment.tz(this.currentUTCTime, this.location.timezone);
            },

            rotation() {
                const midnight       = this.locationTime.clone().startOf('day');
                const secondsPerDay  = 24 * 60 * 60;
                const secondsPassed  = this.locationTime.diff(midnight, 'seconds');
                const rotation       = secondsPassed / secondsPerDay * 360;
                const rotationOffset = -90;


                return Math.floor(rotation + rotationOffset);
            },

            wrapperStyles() {
                return {
                    transform: `rotate(${this.rotation}deg)`,
                }
            },

            balanceStyles() {
                return {
                    transform: `rotate(${-this.rotation}deg)`,
                };
            },

            formattedTime() {
                return this.locationTime.format('HH:mm')
            },
        },
    }
</script>