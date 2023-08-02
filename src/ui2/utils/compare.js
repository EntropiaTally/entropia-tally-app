import isEqual from 'lodash.isequal';
import { shallow } from 'zustand/shallow';

export const shallowCompare = (oldData, newData) => shallow(oldData, newData);
export const deepCompare = (oldData, newData) => isEqual(oldData, newData);
export const arrayCompare = (oldData, newData) => oldData.length === newData.length;
