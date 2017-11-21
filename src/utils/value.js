import { is, compose, gte, test } from 'ramda';

export const isBoolean = is(Boolean);
export const isNumber = is(Number);
export const isObject = is(Object);
export const isString = is(String);

export const isRatioString = test(/^\d+ ?\/ ?\d+$/); // {number} / {number}
export const isPositiveInteger = compose(Number.isInteger, gte(0));
