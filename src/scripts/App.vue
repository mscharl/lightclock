<script>
    import Clock from './components/Clock.vue';

    export default {
        functional: true,

        render(createElement) {
            return createElement('div', {
                attrs: {
                    id: 'app',
                },
            }, [
                createElement('main', {
                    'class': 'App',
                }, [
                    createElement(Clock, {
                        'class': 'App__clock',
                    }),
                ]),
            ]);
        },
    }
</script>
