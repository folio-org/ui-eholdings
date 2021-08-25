import {
  render,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import ScrollView from './scroll-view';
import Harness from '../../../test/jest/helpers/harness';

const mockOnUpdate = jest.fn();

const getScrollView = (props = {}) => (
  <Harness>
    <ScrollView
      fullWidth
      isMainPageSearch
      itemHeight={64}
      items={[]}
      length={10}
      offset={1}
      onUpdate={mockOnUpdate}
      prevNextButtons={<div>PrevNextButtons</div>}
      scrollable
      {...props}
    >
      {props.children}
    </ScrollView>
  </Harness>
);

const renderScrollView = (props) => render(getScrollView(props));

describe('Given ScrollView', () => {
  afterEach(() => {
    cleanup();
    mockOnUpdate.mockClear();
  });

  it('should display PrevNextButtons', () => {
    const { getByText } = renderScrollView();

    expect(getByText('PrevNextButtons')).toBeDefined();
  });

  it('should render items', () => {
    const { getAllByText } = renderScrollView({
      items: new Array(50).fill({}),
      children: () => <div>Child item</div>,
    });

    expect(getAllByText('Child item')).toHaveLength(50);
  });

  describe('when there are more than 100 items', () => {
    it('should render only 100 items', () => {
      const { getAllByText } = renderScrollView({
        items: new Array(200).fill({}),
        children: () => <div>Child item</div>,
      });

      expect(getAllByText('Child item')).toHaveLength(100);
    });
  });

  describe('when page changes', () => {
    it('should render new items', () => {
      const items = new Array(200).fill({}).map((_, index) => ({ name: `Child item ${index + 1}` }));

      const {
        getByText,
        rerender,
      } = renderScrollView({
        items,
        children: (item) => <div>{item.name}</div>,
      });

      expect(getByText('Child item 1')).toBeDefined();
      expect(getByText('Child item 100')).toBeDefined();

      rerender(getScrollView({
        items,
        children: (item) => <div>{item.name}</div>,
        offset: 2,
      }));

      expect(getByText('Child item 101')).toBeDefined();
      expect(getByText('Child item 200')).toBeDefined();
    });
  });

  describe('when scrolling', () => {
    it('should call onUpdate', async () => {
      const { getByTestId } = renderScrollView({
        items: new Array(1000).fill({}),
        children: () => <div>Child item</div>,
        queryListName: 'scroll-view-list',
      });

      fireEvent.scroll(getByTestId('scroll-view-list'), { currentTarget: { scrollTop: 1000 } });

      await waitFor(() => {
        expect(mockOnUpdate).toBeCalled();
      });
    });
  });
});
