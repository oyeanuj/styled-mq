import { either } from 'ramda';
import { isNumber, isPositiveNumberWithResolutionUnit } from '../utils/value';

export default {
  message: "You must supply 'resolution' as a positive number",
  validate: isNumber,
  validateExplicit: value =>
    either(isNumber, isPositiveNumberWithResolutionUnit)(value),
};