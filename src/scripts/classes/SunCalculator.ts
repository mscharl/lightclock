import axios, {AxiosResponse} from 'axios';
import Cache from './Cache';
import * as moment from 'moment';
import {tap} from '../helper/utils'

const api = axios.create({
    baseURL: 'https://api.sunrise-sunset.org/json'
});

const CALL_CACHE: Map<string, Promise<SunriseSunset.Times>> = new Map();

/**
 * Sunrise and Sunset calculator.
 * Uses the {@link https://sunrise-sunset.org} API
 */
export default class SunCalculator {

    private _promise: Promise<SunriseSunset.Times>;


    constructor(year: number, month: number, date: number, lat: number, lng: number) {
        this._promise = this.getRequest(year, month, date, lat, lng)!;
    }

    get sunrise(): Promise<number> {
        return this._promise
            .then((times) => times.sunrise);
    }

    get sunset(): Promise<number> {
        return this._promise
            .then((times) => times.sunset);
    }

    private parseResponse(response: AxiosResponse<SunriseSunset.APIResponse>): SunriseSunset.Times {
        const sunrise = moment.utc(response.data.results.sunrise).valueOf();
        const sunset = moment.utc(response.data.results.sunset).valueOf();

        return {sunrise, sunset};
    }

    private getRequest(year: number, month: number, date: number, lat: number, lng: number) {
        const params: SunriseSunset.APIRequestParams = {
            lat,
            lng,
            date: `${year}-${month}-${date}`,
            formatted: 0
        };
        const key = `${lat}|${lng}|${params.date}`;

        if (CALL_CACHE.has(key)) {
            return CALL_CACHE.get(key);
        }

        if (Cache.has(key)) {
            const value = Cache.get<SunriseSunset.Times>(key);
            return Promise.resolve(value!);
        }


        const requestPromise = api.get<SunriseSunset.APIResponse>('', {
            params
        }).then(this.parseResponse);


        return tap(requestPromise, (promise) => {

            CALL_CACHE.set(key, promise);

            promise.then(() => {
                CALL_CACHE.delete(key);
            });
            promise.then((times: SunriseSunset.Times) => tap(times, () => {
                Cache.set(key, 1440, times);
            }));
        });
    }
}