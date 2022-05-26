import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { FormattedMessage } from 'react-intl';

import useFetchExportTitlesFromPackage from './useFetchExportTitlesFromPackage';

global.fetch = jest.fn();

const packageName = 'packageName';
const packageId = 'packageId';
const platformType = 'platformType';


const sendCalloutMock = jest.fn();
const removeCalloutMock = jest.fn();

const props = {
  packageName,
  packageId,
  platformType,
  callout: {
    sendCallout: sendCalloutMock,
    removeCallout: removeCalloutMock,
  },
};

const TestComponent = () => {
  const { setIsLoading } = useFetchExportTitlesFromPackage(props);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsLoading(true)}
      >
        Export titles
      </button>
    </>
  );
};

describe('Given useFetchExportTitlesFromPackage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send callout with In progress message', () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      text: async () => 'test text',
    });

    const { getByText } = render(<TestComponent />);

    fireEvent.click(getByText('Export titles'));

    expect(sendCalloutMock).toHaveBeenCalledWith({
      message: <FormattedMessage id="ui-eholdings.usageConsolidation.summary.exportTitles.progress" />,
      type: 'success',
    });
  });

  it('should send callout with Success message', () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      text: async () => 'test text',
    });

    const { getByText } = render(<TestComponent />);

    fireEvent.click(getByText('Export titles'));

    waitFor(() => {
      expect(sendCalloutMock).toHaveBeenCalledWith({
        message: <FormattedMessage id="ui-eholdings.usageConsolidation.summary.exportTitles.success" />,
        type: 'success',
      });
    });
  });

  describe('when responce status is 504', () => {
    it('should send callout with Timeout error message', () => {
      global.fetch.mockResolvedValueOnce({
        status: 504,
        text: async () => 'test text',
      });

      const { getByText } = render(<TestComponent />);

      fireEvent.click(getByText('Export titles'));

      waitFor(() => {
        expect(sendCalloutMock).toHaveBeenCalledWith({
          message: <FormattedMessage id="ui-eholdings.usageConsolidation.summary.exportTitles.error.timeout" />,
          type: 'error',
        });
      });
    });
  });

  describe('when responce status is 4XX', () => {
    it('should send callout with Service error message', () => {
      global.fetch.mockResolvedValueOnce({
        status: 400,
        text: async () => 'test text',
      });

      const { getByText } = render(<TestComponent />);

      fireEvent.click(getByText('Export titles'));

      waitFor(() => {
        expect(sendCalloutMock).toHaveBeenCalledWith({
          message: <FormattedMessage id="ui-eholdings.usageConsolidation.summary.exportTitles.error.service" />,
          type: 'error',
        });
      });
    });
  });
});
