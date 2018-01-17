import {tap} from '../helper/utils'

const NO_VALUE_SYMBOL = Symbol('NO_VALUE');

export default new class Cache {

    private dataLayer: Storage;

    constructor() {
        this.dataLayer = window.localStorage;
    }


    /**
     * Check if a value exists
     *
     * @param {string} key
     * @returns {boolean}
     */
    has(key: string): boolean {
        // Get the value internally
        const value = this._get(key);

        // Return if a value exists or not
        return value !== NO_VALUE_SYMBOL;
    }

    /**
     * Get a value from the cache
     *
     * @param {string} key
     * @returns {TCacheValue}
     */
    get<TCacheValue>(key: string): TCacheValue | undefined {
        // Get the value internally
        const value = this._get<TCacheValue>(key);

        // Return the value only if it exists
        if (value !== NO_VALUE_SYMBOL) {
            return value as TCacheValue
        }
    }


    /**
     * Private getter
     * Returns an internal flag if the value is not available
     *
     * @param {string} key
     * @returns {Symbol | TCacheValue}
     * @private
     */
    private _get<TCacheValue>(key: string): TCacheValue | Symbol {
        // Get the item from the data layer
        const item = this.dataLayer.getItem(key);

        // Only continue if an item is available
        if (item) {
            // Unserialize the item
            const data = JSON.parse(item);

            // Ensure that the item has not expired
            if (data.expiresAt > new Date()) {
                return data.value;
            }

            // Remove the key if the item has expired
            this.remove(key);
        }

        // Since there was nothing to return we return the `NO_VALUE_SYMBOL`-symbol
        return NO_VALUE_SYMBOL;
    }

    /**
     * Add a new value or replace an existing one
     *
     * @param {string} key
     * @param {number} ttl The time to live in minutes
     * @param value
     */
    set(key: string, ttl: number, value: any) {
        // Calculate the expiration date
        const expiresAt = (+new Date()) + (ttl * 60 * 1000);
        //
        const hashedKey = btoa(key);

        // Serialize the data
        const data = JSON.stringify({
            value,
            expiresAt
        });

        // Cache the item
        this.dataLayer.setItem(key, data);
    }

    /**
     * Deletes data from the Cache
     *
     * @param {string} key
     */
    remove(key: string) {
        this.dataLayer.removeItem(key);
    }

    /**
     * Remembers the value returned in the callback.
     * The callback is executed if the key is not cached already
     *
     * @param {string} key
     * @param {number} ttl The time to live in minutes
     * @param {function} callback
     * @returns {TCacheValue}
     */
    remember<TCacheValue>(key: string, ttl: number, callback: () => TCacheValue): TCacheValue {
        // Check if the item already exists and return it
        if (this.has(key)) {
            return this.get<TCacheValue>(key)!;
        }

        // If nothing is cached execute the callback cache the return value and return it
        return tap(callback(), (value) => {
            this.set(key, ttl, value);
        });
    }
}