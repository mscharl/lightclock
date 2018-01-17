/**
 * Call the given Closure with the given value then return the value.
 * Inspired by Laravel Framework
 *
 * @param {TValue} value
 * @param {(value: TValue) => void} callback
 * @returns {TValue}
 */
export function tap<TValue = any>(value: TValue, callback: (value: TValue) => void): TValue {
    callback(value);
    return value;
}