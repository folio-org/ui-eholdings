import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedDate,
  useIntl,
} from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  Icon,
  IconButton,
} from '@folio/stripes/components';

const COLUMN_NAMES = ['startDate', 'status', 'name', 'actions'];
const COLUMN_WIDTHS = {
  startDate: '30%',
  name: '30%',
  status: '30%',
  actions: '10%',
};

const propTypes = {
  agreements: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const AgreementsList = ({ agreements, unassignAgreement }) => {
  const { formatMessage } = useIntl();

  const columnsMap = {
    startDate: formatMessage({ id: 'ui-eholdings.startDate' }),
    name: formatMessage({ id: 'ui-eholdings.name' }),
    status: formatMessage({ id: 'ui-eholdings.status' }),
    actions: '',
  };

  const rowFormatter = row => {
    const {
      rowClass,
      rowData: { id },
      rowProps,
      cells,
      labelStrings,
    } = row;

    const ermAgreementUrl = `/erm/agreements/${id}`;
    const ariaLabel = labelStrings && labelStrings.join('...');

    return (
      <div
        role="listitem"
        key={id}
      >
        <Link
          data-test-agreements-list-item
          to={ermAgreementUrl}
          aria-label={ariaLabel}
          className={rowClass}
          {...rowProps}
        >
          {cells}
        </Link>
      </div>
    );
  };

  const getResults = () => agreements.items.map(agreement => {
    const {
      id,
      name,
      startDate,
      agreementStatus,
    } = agreement;

    return {
      id,
      name,
      status: agreementStatus.label,
      startDate: (
        <FormattedDate
          value={startDate}
          year="numeric"
          month="numeric"
          day="numeric"
          timeZone="UTC"
        />
      ),
    };
  });
  
  const formatter = {
    startDate: ({ startDate }) => startDate,
    status: ({ status }) => status,
    name: ({ name }) => name,
    actions: ({ id }) => (
      <IconButton
        icon="trash"
        onClick={(e) => { e.preventDefault(); console.log('here', unassignAgreement); unassignAgreement(id); }}
        data-test-delete-agreement
      />
    )
  };

  return agreements.isLoading
    ? <Icon icon="spinner-ellipsis" />
    : (
        <MultiColumnList
          id="agreements-list"
          interactive
          ariaLabel={formatMessage({ id: 'ui-eholdings.agreements' })}
          contentData={getResults()}
          visibleColumns={COLUMN_NAMES}
          columnMapping={columnsMap}
          columnWidths={COLUMN_WIDTHS}
          isEmptyMessage={<FormattedMessage id="ui-eholdings.agreements.notFound" />}
          rowFormatter={rowFormatter}
          formatter={formatter}
        />
      );
};

AgreementsList.propTypes = propTypes;

export default AgreementsList;
