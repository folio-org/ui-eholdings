/* eslint-disable import/prefer-default-export */
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';

import { PAYLOAD_READY_FIELDS_BY_RECORD_TYPE } from './constants';

export const formatExportFieldsPayload = (fields, recordType) => {
  return flatten(fields.map(field => PAYLOAD_READY_FIELDS_BY_RECORD_TYPE[recordType][field]?.() || []));
};

export const sortAlphabetically = (options) => sortBy(options, option => option.label.toLowerCase());
