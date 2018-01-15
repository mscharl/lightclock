<template>
    <section class="Clock">
        <aside class="Clock__background">
            <div class="Clock__hemisphere Clock__hemisphere--day"></div>
            <div class="Clock__hemisphere Clock__hemisphere--night"></div>
        </aside>
        <section class="Clock__hands">
            <div class="Clock__hand" :style="locationRotation()">
                <div class="Clock__location" :style="locationBalance()">
                    {{formattedTime()}}
                </div>
            </div>
        </section>
    </section>
</template>

<script>
    import moment from 'moment';
    import { mapGetters } from 'vuex';

    import * as getterTypes from '../store/types/getters'

    export default {
        name: 'Clock',

        computed: {
            ...mapGetters({
                currentTime: getterTypes.CURRENT_TIME,
            }),
        },

        methods: {
            rotation() {
                const midnight       = moment().hours(0).minutes(0).seconds(0);
                const now            = moment(this.currentTime);
                const secondsPerDay  = 24 * 60 * 60;
                const secondsPassed  = now.diff(midnight, 'seconds');
                const rotation       = secondsPassed / secondsPerDay * 360;
                const rotationOffset = -90;


                return Math.floor(rotation + rotationOffset);
            },
            locationRotation() {
                return {
                    transform: `rotate(${this.rotation()}deg)`,
                };
            },
            locationBalance() {
                return {
                    transform: `rotate(${-this.rotation()}deg)`,
                };
            },

            formattedTime() {
                return moment(this.currentTime).format('HH:mm')
            },
        },
    }
</script>