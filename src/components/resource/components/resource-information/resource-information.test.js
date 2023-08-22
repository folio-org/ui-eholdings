import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../test/jest/helpers/harness';

import ResourceInformation from './resource-information';

jest.mock('../../../contributors-list', () => () => <div>Contributors list</div>);
jest.mock('../../../identifiers-list', () => () => <div>Identifiers list</div>);

describe('Given ResourceInformation', () => {
  let component;
  const onToggleMock = jest.fn();

  const defaultModel = {
    data: {
      attributes: {
        isTokenNeeded: true,
        alternateTitles: [{
          alternateTitle: 'alternateTitle1',
        }, {
          alternateTitle: 'alternateTitle2',
        }, {
          alternateTitle: 'alternateTitle3',
        },
        ],
      },
    },
    titleId: 'title-id',
    title: {
      name: 'title name',
      edition: 'title edition',
      contributors: [],
      publisherName: 'publisher name',
      publicationType: 'publication type',
      identifiers: [],
      subjects: [{
        subject: 'subject1',
      }, {
        subject: 'subject2',
      }],
      isPeerReviewed: false,
      isTitleCustom: false,
      description: 'title description',
    },
    packageId: 'package-id',
    providerId: 'provider-id',
    package: {
      name: 'package name',
      providerName: 'provider name',
      contentType: 'content type',
    },
  };

  const renderResourceInformation = (props = {}) => render(
    <Harness>
      <ResourceInformation
        isOpen
        onToggle={onToggleMock}
        model={defaultModel}
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderResourceInformation();
    expect(component.getByText('ui-eholdings.resource.resourceInformation')).toBeDefined();
  });

  it('should display a link to title', () => {
    component = renderResourceInformation();
    expect(component.getByText('title name').href).toBe('http://localhost/eholdings/titles/title-id');
  });

  it('should display an alternates titles', () => {
    component = renderResourceInformation();
    expect(component.getByText('alternateTitle1; alternateTitle2; alternateTitle3')).toBeDefined();
  });

  it('should display title edition', () => {
    component = renderResourceInformation();
    expect(component.getByText('title edition')).toBeDefined();
  });

  it('should display contributors list', () => {
    component = renderResourceInformation();
    expect(component.getByText('Contributors list')).toBeDefined();
  });

  it('should display publisher name', () => {
    component = renderResourceInformation();
    expect(component.getByText('publisher name')).toBeDefined();
  });

  it('should display publication type', () => {
    component = renderResourceInformation();
    expect(component.getByText('publication type')).toBeDefined();
  });

  it('should display contributors list', () => {
    component = renderResourceInformation();
    expect(component.getByText('Identifiers list')).toBeDefined();
  });

  it('should display subjects', () => {
    component = renderResourceInformation();
    expect(component.getByText('subject1; subject2')).toBeDefined();
  });

  it('should display peer reviewed field', () => {
    component = renderResourceInformation();
    expect(component.getByTestId('peer-reviewed-field').textContent).toEqual('ui-eholdings.no');
  });

  it('should display package details type', () => {
    component = renderResourceInformation();
    expect(component.getByTestId('package-details-type').textContent).toEqual('ui-eholdings.managed');
  });

  it('should display title description', () => {
    component = renderResourceInformation();
    expect(component.getByText('title description')).toBeDefined();
  });

  it('should display a link to package', () => {
    component = renderResourceInformation();
    expect(component.getByText('package name').href).toBe('http://localhost/eholdings/packages/package-id');
  });

  it('should display add token button', () => {
    component = renderResourceInformation();
    expect(component.getByText('ui-eholdings.package.addToken')).toBeDefined();
  });

  it('should display a link to provider', () => {
    component = renderResourceInformation();
    expect(component.getByText('provider name').href).toBe('http://localhost/eholdings/providers/provider-id');
  });

  it('should display package content type', () => {
    component = renderResourceInformation();
    expect(component.getByText('content type')).toBeDefined();
  });
});
