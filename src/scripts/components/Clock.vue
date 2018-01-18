<template>
    <section class="Clock">
        <aside class="Clock__background">
            <div class="Clock__hemisphere Clock__hemisphere--day"></div>
            <div class="Clock__hemisphere Clock__hemisphere--night"></div>
        </aside>

        <div class="Clock__shadow"></div>

        <section class="Clock__hands">
            <location v-for="location in locations" :location="location" :key="location.name"></location>
        </section>
    </section>
</template>

<script>
    import moment from 'moment';
    import { mapGetters } from 'vuex';

    import * as getterTypes from '../store/types/getters'

    import Location from './Location.vue';

    export default {
        name: 'Clock',

        components: {
            Location,
        },

        computed: {
            ...mapGetters({
                currentTime: getterTypes.CURRENT_TIME,
                locations  : getterTypes.LOCATIONS,
            }),
        },
    }
</script>