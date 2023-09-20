import { isEqual } from 'lodash';

export const deepCompareState = (oldState: unknown, newState: unknown) => isEqual(oldState, newState);
