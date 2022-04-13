import { render } from '@testing-library/react';

import AccordionListHeader from './accordion-list-header';
import { listTypes } from '../../constants';
import IntlProvider from '../../../test/jest/helpers/intl';

const renderAccordionListHeader = (props) => render(
  <IntlProvider>
    <AccordionListHeader
      open
      listType={listTypes.TITLES}
      resultsLength={10000}
      label="Test label"
      {...props}
    />
  </IntlProvider>
);

describe('Given AccordionListHeader', () => {
  describe('when list type is title', () => {
    it('should show custom label with value', () => {
      const { queryByText } = renderAccordionListHeader();

      expect(queryByText('ui-eholdings.over')).toBeDefined();
      expect(queryByText('10,001')).toBeDefined();
    });
  });

  describe('when list type is package and result length is less then over count', () => {
    it('should show result length', () => {
      const { getByText } = renderAccordionListHeader({
        listType: listTypes.PACKAGES,
        resultsLength: 10,
      });

      expect(getByText('10')).toBeDefined();
    });
  });
});
