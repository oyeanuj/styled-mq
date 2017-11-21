import {
  compose,
  toPairs,
  partial,
  mergeDeepLeft,
  merge,
  mergeAll,
  map,
} from 'ramda';

import buildRangedFeature from './features/buildRangedFeature';
import buildMediaType from './features/buildMediaType';
import buildFeature from './features/buildFeature';

import {
  validateBreakpointSets,
  validateConfig,
  validateBreakpoints,
} from './validations';

import dimensionsOutput from './output/dimensionsOutput';
import resolutionOutput from './output/resolutionOutput';
import aspectRatioOutput from './output/aspectRatioOutput';

import { MEDIA_TYPES, UNITS, FEATURES } from './const';

const defaultConfig = {
  baseFontSize: 16,
  defaultMediaType: MEDIA_TYPES.SCREEN,
  dimensionsUnit: UNITS.DIMENSIONS.EM,
  shouldSeparateQueries: true,
  errorIfNoBreakpointDefined: true,
};

const toFeatures = compose(
  map(([key, value]) => {
    const o = {};
    o[key] = buildFeature(key, value);
    return o;
  }),
  toPairs
);

const configure = (breakpoints, config) => {
  const configWithDefaults = merge(defaultConfig, config);
  validateConfig(configWithDefaults);
  validateBreakpoints(breakpoints);
  validateBreakpointSets(breakpoints);

  const renderFeatures = () => mergeAll(toFeatures(FEATURES));

  const renderRangeFeatures = () =>
    mergeAll([
      buildRangedFeature(
        'width',
        dimensionsOutput(config),
        breakpoints.width,
        configWithDefaults
      ),
      buildRangedFeature(
        'height',
        dimensionsOutput(config),
        breakpoints.height,
        configWithDefaults
      ),
      buildRangedFeature(
        'resolution',
        resolutionOutput(config),
        breakpoints.resolution,
        configWithDefaults
      ),
      buildRangedFeature(
        'aspect-ratio',
        aspectRatioOutput(config),
        breakpoints.aspectRatio,
        configWithDefaults
      ),
    ]);

  // ---------------------------------------------------------------------------
  // API
  // ---------------------------------------------------------------------------

  // Tweak
  // ---------------------------------------------------------------------------

  const tweak = (mq, tweakpoints) => {
    validateBreakpoints(tweakpoints);
    validateBreakpointSets(tweakpoints);
    const mergedBreakpoints = mergeDeepLeft(breakpoints, tweakpoints);
    mq.tweaked = configure(mergedBreakpoints, configWithDefaults);
    return mq;
  };

  // Media Query Features
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Export
  // ---------------------------------------------------------------------------

  const exports = {
    mediaType: buildMediaType(configWithDefaults.defaultMediaType),
    ...renderFeatures(),
    ...renderRangeFeatures(),
  };

  exports.tweak = partial(tweak, [exports]);
  return exports;
};

export default {
  configure,
};
