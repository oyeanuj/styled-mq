import { css } from 'styled-components';
import { MEDIA_PREFIX } from './const';

export const renderFeature = (name, value) => `(${name}: ${value})`;

export const renderQueryDefinition = (...elements) =>
  `${MEDIA_PREFIX} ${elements.join(' and ')}`;

export const renderQuery = (definition, content) => css`
  ${definition} {
    ${content};
  }
`;
