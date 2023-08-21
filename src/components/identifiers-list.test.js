import { render } from '@folio/jest-config-stripes/testing-library/react';

import IdentifiersList from './identifiers-list';

const testPropsForKeyValueList = {
  data: [
    {
      id: 'test-first-id',
      subtype: 'test-subtype',
      type: 'ISBN',
    },
    {
      id: 'test-second-id',
      subtype: 'test-subtype',
      type: 'ISBN',
    },
    {
      id: 'test-third-id',
      subtype: 'Empty',
      type: 'ISSN',
    },
    {
      id: 'test-fourth-id',
      subtype: 'test-subtype',
      type: 'ABCD',
    },
  ],
};

const testPropsForInlineList = {
  ...testPropsForKeyValueList,
  displayInline: true,
};

describe('Given IdentifiersList', () => {
  const renderIdentifiersList = ({ ...props }) => render(
    <IdentifiersList {...props} />
  );

  describe('when list is not inline', () => {
    it('should display compound type', () => {
      const { getByText } = renderIdentifiersList(testPropsForKeyValueList);

      expect(getByText('ISBN (test-subtype)')).toBeDefined();
    });

    it('should display identifiers ids', () => {
      const { getByText } = renderIdentifiersList(testPropsForKeyValueList);

      expect(getByText('test-first-id, test-second-id')).toBeDefined();
      expect(getByText('test-third-id')).toBeDefined();
    });
  });

  describe('when list is inline', () => {
    it('should display compound type and identifiers ids in an inline way', () => {
      const { getByText } = renderIdentifiersList(testPropsForInlineList);

      expect(getByText('ISBN (test-subtype): test-first-id, test-second-id • ISSN: test-third-id')).toBeDefined();
    });
  });

  it('should not display an identifier subtype when it equals Empty', () => {
    const { getByText } = renderIdentifiersList(testPropsForInlineList);

    expect(getByText(/ISSN: test-third-id/)).toBeDefined();
  });

  it('should not display an identifier when its type is not ISBN or ISSN', () => {
    const { queryByText } = renderIdentifiersList(testPropsForInlineList);

    expect(queryByText('test-fourth-id')).toBeNull();
  });
});
