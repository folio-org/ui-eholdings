import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  Icon,
} from '@folio/stripes/components';


const COLUMN_NAMES = ['startDate', 'status', 'name'];
const COLUMN_WIDTHS = {
  startDate: '30%',
  name: '40%',
  status: '30%',
};

const columnsMap = {
  startDate: <FormattedMessage id="ui-eholdings.startDate" />,
  name: <FormattedMessage id="ui-eholdings.name" />,
  status: <FormattedMessage id="ui-eholdings.status" />,
};

export default class AgreementsList extends React.Component {
  static propTypes = {
    agreements: PropTypes.object.isRequired,
  }

  rowFormatter = (row) => {
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

  getResults() {
    return this.props.agreements.items
      .map(agreement => {
        const {
          id,
          name,
          startDate,
          agreementStatus,
        } = agreement;

        return {
          id,
          startDate: (
            <FormattedDate
              value={startDate}
              year="numeric"
              month="numeric"
              day="numeric"
            />
          ),
          status: agreementStatus.label,
          name,
        };
      });
  }

  render() {
    return this.props.agreements.isLoading
      ? <Icon icon="spinner-ellipsis" />
      : (
        <FormattedMessage id="ui-eholdings.agreements">
          {
            (ariaLabel) => (
              <MultiColumnList
                id="agreements-list"
                interactive
                ariaLabel={ariaLabel}
                contentData={this.getResults()}
                visibleColumns={COLUMN_NAMES}
                columnMapping={columnsMap}
                columnWidths={COLUMN_WIDTHS}
                isEmptyMessage={<FormattedMessage id="ui-eholdings.agreements.notFound" />}
                rowFormatter={this.rowFormatter}
              />
            )
          }
        </FormattedMessage>
      );
  }
}
