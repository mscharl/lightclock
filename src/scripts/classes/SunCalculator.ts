import axios, {AxiosResponse} from 'axios';
import Cache from './Cache';
import * as moment from 'moment';
import {tap} from '../helper/utils'

// Create an axios instance for easy api use
const api = axios.create({
    baseURL: 'https://api.sunrise-sunset.org/json'
});

// A Instance independent promise cache to avoid loading the same data multiple times
const RUNNING_CALLS: Map<string, Promise<SunriseSunset.Times>> = new Map();


/**
 * Sunrise and Sunset calculator.
 * Uses the {@link https://sunrise-sunset.org} API
 */
export default class SunCalculator {

    // The own promise
    private _promise: Promise<SunriseSunset.Times>;

    private _year: number;
    private _month: number;
    private _date: number;
    private _lat: number;
    private _lng: number;

    constructor(year: number, month: number, date: number, lat: number, lng: number) {
        this._year = year;
        this._month = month;
        this._date = date;
        this._lat = lat;
        this._lng = lng;

        this._promise = this.getRequest()!;
    }

    /**
     * Returns a promise that resolves with the sunrise time in UNIX seconds
     *
     * @returns {Promise<number>}
     */
    get sunrise(): Promise<number> {
        return this._promise
            .then((times) => times.sunrise);
    }

    /**
     * Returns a promise that resolves with the sunset time in UNIX seconds
     *
     * @returns {Promise<number>}
     */
    get sunset(): Promise<number> {
        return this._promise
            .then((times) => times.sunset);
    }

    /**
     * Parse the API response for sunrise and sunset times
     *
     * @param {AxiosResponse<SunriseSunset.APIResponse>} response
     * @returns {SunriseSunset.Times}
     */
    private parseResponse(response: AxiosResponse<SunriseSunset.APIResponse>): SunriseSunset.Times {
        const sunrise = moment.utc(response.data.results.sunrise).valueOf();
        const sunset = moment.utc(response.data.results.sunset).valueOf();

        return {sunrise, sunset};
    }

    /**
     * Create the request promise.
     * Will either be loaded from the cache, `RUNNING_CALLS` or directly via the
     * API if not fetched before.
     *
     * @returns {Promise<SunriseSunset.Times>}
     */
    private getRequest() {
        // Get all required params
        const {_year, _month, _date, _lat, _lng} = this;

        // Create the params object
        const params: SunriseSunset.APIRequestParams = {
            lat: _lat,
            lng: _lng,
            date: `${_year}-${_month}-${_date}`,
            formatted: 0
        };
        // Create the cache key
        const key = `${_lat}|${_lng}|${params.date}`;

        // Check if same call was already sent
        if (RUNNING_CALLS.has(key)) {
            return RUNNING_CALLS.get(key);
        }

        // Check if results are already cached
        if (Cache.has(key)) {
            const value = Cache.get<SunriseSunset.Times>(key);
            return Promise.resolve(value!);
        }

        // Execute the API call
        const requestPromise = api.get<SunriseSunset.APIResponse>('', {
            params
        }).then(this.parseResponse);

        // Return the Promise and cache all required data
        return tap(requestPromise, (promise) => {

            // Cache the promise
            RUNNING_CALLS.set(key, promise);

            // After resolving the request the call is removed from the running calls
            promise.then(() => {
                RUNNING_CALLS.delete(key);
            });

            // After resolving the request the result is cached
            promise.then((times: SunriseSunset.Times) => tap(times, () => {
                Cache.set(key, 1440, times);
            }));
        });
    }
}