import { render } from '@testing-library/react';

import ContributorsList from './contributors-list';

const testPropsForKeyValueList = {
  data: [
    {
      contributor: 'test-first-contributor-name',
      type: 'test-contributor-type',
    },
    {
      contributor: 'test-second-contributor-name',
      type: 'test-contributor-type',
    },
    {
      contributor: 'test-third-contributor-name',
      type: 'test-contributor-type',
    },
  ],
};

const testPropsForInlineList = {
  ...testPropsForKeyValueList,
  showInline: true,
};

const testPropsForInlineListWithLimit = {
  ...testPropsForInlineList,
  contributorsInlineLimit: 2,
};

describe('Given ContributorsList', () => {
  const renderContributorsList = ({ ...props }) => render(
    <ContributorsList {...props} />
  );

  describe('when list is not inline', () => {
    it('should render key-value list', () => {
      const { getByTestId } = renderContributorsList(testPropsForKeyValueList);

      expect(getByTestId('contributors-list-key-value')).toBeDefined();
    });

    it('should display all key-value list elements', () => {
      const { getByText } = renderContributorsList(testPropsForKeyValueList);

      expect(getByText('test-first-contributor-name; test-second-contributor-name; test-third-contributor-name')).toBeDefined();
    });
  });

  describe('when list is inline', () => {
    it('should render inline list', () => {
      const { getByTestId } = renderContributorsList(testPropsForInlineList);

      expect(getByTestId('contributors-list-inline')).toBeDefined();
    });

    it('should display all inline list elements', () => {
      const { getByText, queryByText } = renderContributorsList(testPropsForInlineList);

      expect(queryByText('test-first-contributor-name; test-second-contributor-name...')).toBeNull();
      expect(getByText('test-first-contributor-name; test-second-contributor-name; test-third-contributor-name')).toBeDefined();
    });

    it('should display limited number of inline list elements', () => {
      const { getByText } = renderContributorsList(testPropsForInlineListWithLimit);

      expect(getByText('test-first-contributor-name; test-second-contributor-name...')).toBeDefined();
    });
  });
});
