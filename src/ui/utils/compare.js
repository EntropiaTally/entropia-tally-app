import isEqual from 'lodash.isequal';

export const deepCompare = (oldData, newData) => isEqual(oldData, newData);

export const eventCompare = (oldData, newData) => oldData.length === newData.length;
