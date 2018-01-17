declare namespace SunriseSunset {
    interface APIRequestParams {
        lat: number,
        lng: number,
        date: string,
        formatted: 0 | 1,
    }

    interface APIResponse {

        results: {

            sunrise: string,
            sunset: string,
            solar_noon: string,
            day_length: number,
            civil_twilight_begin: string,
            civil_twilight_end: string,
            nautical_twilight_begin: string,
            nautical_twilight_end: string,
            astronomical_twilight_begin: string,
            astronomical_twilight_end: string,
        },

        status: 'OK' | string
    }

    interface Times {
        sunrise: number,
        sunset: number,
    }
}
