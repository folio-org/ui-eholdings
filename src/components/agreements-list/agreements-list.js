import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  Icon,
  IconButton,
  Tooltip,
  FormattedDate,
} from '@folio/stripes/components';

import { TIME_ZONE } from '../../constants';

const COLUMN_NAMES = ['startDate', 'status', 'name', 'actions'];
const COLUMN_WIDTHS = {
  startDate: '31%',
  name: '32%',
  status: '31%',
  actions: '6%',
};

const propTypes = {
  agreements: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    isUnassigned: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      agreementStatus: PropTypes.shape({
        label: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  onUnassignAgreement: PropTypes.func.isRequired,
};

const AgreementsList = ({
  agreements,
  onUnassignAgreement,
}) => {
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
        role="rowheader"
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

  const contentData = agreements.items.map(agreement => {
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
          timeZone={TIME_ZONE}
        />
      ),
    };
  });

  const formatter = {
    startDate: ({ startDate }) => startDate,
    status: ({ status }) => status,
    name: ({ name }) => name,
    actions: agreement => (
      <Tooltip
        text={<FormattedMessage id="ui-eholdings.agreements.delete" />}
        id={`unassign-agreement-${agreement.id}-tooltip`}
      >
        {({ ref, ariaIds }) => (
          <IconButton
            ref={ref}
            icon="trash"
            aria-labelledby={ariaIds.text}
            onClick={e => {
              e.preventDefault();

              onUnassignAgreement(agreement);
            }}
            data-test-delete-agreement
          />
        )}
      </Tooltip>
    )
  };

  return agreements.isLoading
    ? <Icon icon="spinner-ellipsis" />
    : (
      <MultiColumnList
        id="agreements-list"
        interactive
        ariaLabel={formatMessage({ id: 'ui-eholdings.agreements' })}
        contentData={contentData}
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
