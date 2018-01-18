<template>
    <div class="Location__wrapper" :style="wrapperStyles" v-if="hasSunTimes">
        <div class="Location">
            <orb></orb>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import 'moment-timezone';

    import Orb from './Orb.vue';
    import SunCalculator from '../classes/SunCalculator';

    import * as getterTypes from '../store/types/getters';

    export default {
        name: 'Location',

        components: {
            Orb,
        },

        props: ['location'],

        data() {
            return {
                sunrise        : null,
                sunset         : null,
                sunriseTomorrow: null,
                sunsetTomorrow : null,
            }
        },

        mounted() {
            const checkSunTimes = () => {
                const year  = this.locationTime.year();
                const month = this.locationTime.month() + 1;
                const date  = this.locationTime.date();

                const tomorrow      = this.locationTime.clone().add(1, 'day');
                const yearTomorrow  = tomorrow.year();
                const monthTomorrow = tomorrow.month() + 1;
                const dateTomorrow  = tomorrow.date();

                const calculator         = new SunCalculator(year, month, date, this.location.lat, this.location.lng);
                const calculatorTomorrow = new SunCalculator(yearTomorrow, monthTomorrow, dateTomorrow, this.location.lat, this.location.lng);

                Promise
                    .all([calculator.sunrise, calculator.sunset, calculatorTomorrow.sunrise, calculatorTomorrow.sunset])
                    .then((times) => {
                        const [sunrise, sunset, sunriseTomorrow, sunsetTomorrow] = times;

                        if(this.sunrise !== sunrise) {
                            this.sunrise = moment.tz(sunrise, this.location.timezone);
                        }
                        if(this.sunset !== sunset) {
                            this.sunset = moment.tz(sunset, this.location.timezone);
                        }
                        if(this.sunriseTomorrow !== sunriseTomorrow) {
                            this.sunriseTomorrow = moment.tz(sunriseTomorrow, this.location.timezone);
                        }
                        if(this.sunsetTomorrow !== sunsetTomorrow) {
                            this.sunsetTomorrow = moment.tz(sunsetTomorrow, this.location.timezone);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        const now = moment().tz(this.location.timezone);

                        this.sunrise         = now.clone().hours(6).minutes(0).seconds(0);
                        this.sunset          = now.clone().hours(18).minutes(0).seconds(0);
                        this.sunriseTomorrow = now.clone().add(1, 'day').hours(6).minutes(0).seconds(0);
                        this.sunsetTomorrow  = now.clone().add(1, 'day').hours(18).minutes(0).seconds(0);
                    });
            };

            setTimeout(checkSunTimes, 0);
        },

        computed: {
            ...mapGetters({
                currentUTCTime: getterTypes.CURRENT_TIME,
            }),

            hasSunTimes() {
                return this.sunrise && this.sunset && this.sunriseTomorrow && this.sunsetTomorrow;
            },

            locationTime() {
                return moment.tz(this.currentUTCTime, this.location.timezone);
            },

            rotation() {
                let meanTime;
                let offset;
                let prevSunEvent;

                if(this.locationTime < this.sunset) {
                    meanTime     = this.sunset.diff(this.sunrise, 'seconds');
                    offset       = 0;
                    prevSunEvent = this.sunrise;
                }
                else if(this.locationTime < this.sunriseTomorrow) {
                    meanTime     = this.sunriseTomorrow.diff(this.sunset, 'seconds');
                    offset       = 180;
                    prevSunEvent = this.sunset;
                }
                else if(this.locationTime < this.sunsetTomorrow) {
                    meanTime     = this.sunsetTomorrow.diff(this.sunriseTomorrow, 'seconds');
                    offset       = 0;
                    prevSunEvent = this.sunriseTomorrow;
                }

                const secondsPassed = this.locationTime.diff(prevSunEvent, 'seconds');
                const rotation      = secondsPassed / meanTime * 180;

                return Math.floor(rotation + offset);
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
            }
        },
    }
</script>