import {
  render,
  fireEvent,
} from '@testing-library/react';

import TitleCreate from './title-create';

jest.mock('../_fields/contributor', () => () => (<div>ContributorField component</div>));
jest.mock('../_fields/edition', () => () => (<div>EditionField component</div>));
jest.mock('../_fields/publisher-name', () => () => (<div>PublisherNameField component</div>));
jest.mock('../_fields/publication-type', () => () => (<div>PublicationTypeField component</div>));
jest.mock('../_fields/identifiers', () => () => (<div>IdentifiersFields component</div>));
jest.mock('../_fields/description', () => () => (<div>DescriptionField component</div>));
jest.mock('../_fields/peer-reviewed', () => () => (<div>PeerReviewedField component</div>));
jest.mock('../_fields/package-select', () => () => (<div>PackageSelectField component</div>));
jest.mock('../../navigation-modal', () => ({ when }) => (when ? <div>NavigationModal component</div> : null));

const mapMock = jest.fn();

const customPackages = {
  records: [
    {
      id: 'test-package-id1',
      name: 'test-package-name1',
    },
    {
      id: 'test-package-id2',
      name: 'test-package-name2',
    },
  ],
  map: mapMock,
};

const request = {
  errors: [],
};

describe('Given TitleCreate', () => {
  const renderTitleCreate = (props = {}) => render(
    <TitleCreate
      customPackages={customPackages}
      onCancel={() => {}}
      onPackageFilter={() => {}}
      onSubmit={() => {}}
      removeCreateRequests={() => {}}
      request={request}
      {...props}
    />
  );

  it('should render the TitleCreate component', () => {
    const { getByTestId } = renderTitleCreate();

    expect(getByTestId('title-create')).toBeDefined();
  });

  it('should display the first menu pane', () => {
    const {
      getByText,
      getByRole,
    } = renderTitleCreate();

    expect(getByText('ui-eholdings.title.create.paneTitle')).toBeDefined();
    expect(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' })).toBeDefined();
  });

  it('should display the `title information` title', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('ui-eholdings.title.titleInformation')).toBeDefined();
  });

  it('should display the `package information` title', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('ui-eholdings.label.packageInformation')).toBeDefined();
  });

  it('should display footer buttons', () => {
    const { getByRole } = renderTitleCreate();

    expect(getByRole('button', { name: 'stripes-components.cancel' })).toBeDefined();
    expect(getByRole('button', { name: 'stripes-components.saveAndClose' })).toBeDefined();
  });

  it('should render the NameField component', () => {
    const { getByRole } = renderTitleCreate();

    expect(getByRole('textbox', { name: 'ui-eholdings.label.name' })).toBeDefined();
  });

  it('should render the ContributorField component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('ContributorField component')).toBeDefined();
  });

  it('should render the EditionField component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('EditionField component')).toBeDefined();
  });

  it('should render the PublisherNameField component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('PublisherNameField component')).toBeDefined();
  });

  it('should render the PublicationTypeField component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('PublicationTypeField component')).toBeDefined();
  });

  it('should render the IdentifiersFields component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('IdentifiersFields component')).toBeDefined();
  });

  it('should render the DescriptionField component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('DescriptionField component')).toBeDefined();
  });

  it('should render the PeerReviewedField component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('PeerReviewedField component')).toBeDefined();
  });

  it('should render the PackageSelectField component', () => {
    const { getByText } = renderTitleCreate();

    expect(getByText('PackageSelectField component')).toBeDefined();
  });

  describe('when click on close icon and form is not pristine', () => {
    it('should show navigation modal', () => {
      const {
        getByRole,
        getByText,
      } = renderTitleCreate();

      const titleNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(titleNameInput, { target: { value: 'Title name' } });
      fireEvent.blur(titleNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(getByText('NavigationModal component')).toBeDefined();
    });
  });

  describe('when an error occurs', () => {
    it('should show toast with the message', () => {
      const { getByText } = renderTitleCreate({
        request: {
          errors: [
            {
              title: 'Error title',
            },
          ],
        },
      });

      expect(getByText('Error title')).toBeDefined();
    });
  });
});
