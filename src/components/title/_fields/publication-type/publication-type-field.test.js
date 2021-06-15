import { Form } from 'react-final-form';
import { render } from '@testing-library/react';

import PublicationTypeField from './publication-type-field';

describe('Given PublicationTypeField', () => {
  const renderPublicationTypeField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <PublicationTypeField />}
    />
  );

  it('should render peer reviewed field', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.title.publicationType')).toBeDefined();
  });

  it('should display Audiobook option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.audioBook')).toBeDefined();
  });

  it('should display Book option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.book')).toBeDefined();
  });

  it('should display Book Series option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.bookSeries')).toBeDefined();
  });

  it('should display Database option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.database')).toBeDefined();
  });

  it('should display Journal option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.journal')).toBeDefined();
  });

  it('should display Newsletter option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.newsletter')).toBeDefined();
  });

  it('should display Newspaper option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.newspaper')).toBeDefined();
  });

  it('should display Proceedings option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.proceedings')).toBeDefined();
  });

  it('should display Report option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.report')).toBeDefined();
  });

  it('should display Streaming Audio option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.streamingAudio')).toBeDefined();
  });

  it('should display Streaming Video option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.streamingVideo')).toBeDefined();
  });

  it('should display Thesis/Dissertation option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.thesisdissertation')).toBeDefined();
  });

  it('should display Unspecified option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.unspecified')).toBeDefined();
  });

  it('should display Web Site option', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.filter.pubType.website')).toBeDefined();
  });
});
