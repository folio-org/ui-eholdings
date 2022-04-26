import { render } from '@testing-library/react';

import IntlProvider from '../../../test/jest/helpers/intl';

import CoverageDateList from './coverage-date-list';

const coverageArrayWithBeginDate = [{ beginCoverage: '2020-12-01' }];
const coverageArrayWithEndDate = [{ endCoverage: '2021-01-31' }];
const coverageArrayWithBeginAndEndDates = [{
  beginCoverage: '2020-12-01',
  endCoverage: '2021-01-31',
}];
const coverageArrayWithSeveralBeginAndEndDates = [
  {
    beginCoverage: '2016-05-01',
    endCoverage: '2016-06-01',
  },
  {
    beginCoverage: '2020-12-01',
    endCoverage: '2021-01-31',
  },
];

const testProps = {
  id: 'test-id',
};

const testPropsExtended = {
  ...testProps,
  isManagedCoverage: true,
  isYearOnly: true,
};

const addCoverageArrayToProps = (props, coverageArray) => {
  return {
    ...props,
    coverageArray,
  };
};

describe('Given CoverageDateList', () => {
  const renderCoverageDateList = ({ ...props }) => render(
    <IntlProvider>
      <CoverageDateList
        id="coverage-date-list"
        {...props}
      />
    </IntlProvider>
  );

  it('should render custom CoverageDateList component', () => {
    const finalProps = addCoverageArrayToProps(testProps, coverageArrayWithBeginAndEndDates);

    const { getByTestId } = renderCoverageDateList(finalProps);

    expect(getByTestId('coverage-list-custom')).toBeDefined();
  });

  it('should display beginCoverage date and Present', () => {
    const finalProps = addCoverageArrayToProps(testProps, coverageArrayWithBeginDate);

    const { getByText } = renderCoverageDateList(finalProps);

    expect(getByText('12/1/2020 - ui-eholdings.date.present')).toBeDefined();
  });

  it('should display endCoverage date', () => {
    const finalProps = addCoverageArrayToProps(testProps, coverageArrayWithEndDate);

    const { getByText } = renderCoverageDateList(finalProps);

    expect(getByText('1/31/2021')).toBeDefined();
  });

  it('should display coverage dates', () => {
    const finalProps = addCoverageArrayToProps(testProps, coverageArrayWithBeginAndEndDates);

    const { getByText } = renderCoverageDateList(finalProps);

    expect(getByText('12/1/2020 - 1/31/2021')).toBeDefined();
  });

  it('should display all coverage dates in descending order', () => {
    const finalProps = addCoverageArrayToProps(testProps, coverageArrayWithSeveralBeginAndEndDates);

    const { getByText } = renderCoverageDateList(finalProps);

    expect(getByText('12/1/2020 - 1/31/2021, 5/1/2016 - 6/1/2016')).toBeDefined();
  });

  it('should render managed CoverageDateList component', () => {
    const finalProps = addCoverageArrayToProps(testPropsExtended, coverageArrayWithBeginAndEndDates);

    const { getByTestId } = renderCoverageDateList(finalProps);

    expect(getByTestId('coverage-list-managed')).toBeDefined();
  });

  it('should display only coverage years', () => {
    const finalProps = addCoverageArrayToProps(testPropsExtended, coverageArrayWithBeginAndEndDates);

    const { getByText } = renderCoverageDateList(finalProps);

    expect(getByText('2020 - 2021')).toBeDefined();
  });

  it('should display all coverage years', () => {
    const finalProps = addCoverageArrayToProps(testPropsExtended, coverageArrayWithSeveralBeginAndEndDates);

    const { getByText } = renderCoverageDateList(finalProps);

    expect(getByText('2020 - 2021, 2016')).toBeDefined();
  });
});
