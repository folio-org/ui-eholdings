import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  Button,
  Headline,
  KeyValue,
  Row,
  Col,
} from '@folio/stripes/components';

import InternalLink from '../../../internal-link';
import IdentifiersList from '../../../identifiers-list';
import ContributorsList from '../../../contributors-list';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const ResourceInformation = ({
  isOpen,
  onToggle,
  model,
}) => {
  const isTokenNeeded = model.data.attributes && model.data.attributes.isTokenNeeded;

  return (
    <Accordion
      label={(
        <Headline size="large" tag="h3">
          <FormattedMessage id="ui-eholdings.resource.resourceInformation" />
        </Headline>
      )}
      open={isOpen}
      id="resourceShowInformation"
      onToggle={onToggle}
    >
      <Row>
        <Col md={6}>
          <KeyValue label={<FormattedMessage id="ui-eholdings.label.title" />}>
            <InternalLink to={`/eholdings/titles/${model.titleId}`}>
              {model.title.name}
            </InternalLink>
          </KeyValue>

          {!isEmpty(model.data.attributes.alternateTitles) && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.label.alternateTitle" />}>
              {model.data.attributes.alternateTitles
                .map(({ alternateTitle }) => alternateTitle)
                .join('; ')
              }
            </KeyValue>
          )}

          {model.title.edition && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.label.edition" />}>
              <div data-test-eholdings-resource-show-edition>
                {model.title.edition}
              </div>
            </KeyValue>
          )}

          <ContributorsList data={model.title.contributors} />

          {model.title.publisherName && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.label.publisher" />}>
              <div data-test-eholdings-resource-show-publisher-name>
                {model.title.publisherName}
              </div>
            </KeyValue>
          )}

          {model.title.publicationType && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.label.publicationType" />}>
              <div data-test-eholdings-resource-show-publication-type>
                {model.title.publicationType}
              </div>
            </KeyValue>
          )}

          <IdentifiersList data={model.title.identifiers} />

          {model.title.subjects.length > 0 && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.label.subjects" />}>
              <div data-test-eholdings-resource-show-subjects-list>
                {model.title.subjects.map(subjectObj => subjectObj.subject).join('; ')}
              </div>
            </KeyValue>
          )}

          {model.title.description && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.label.description" />}>
              <div data-test-eholdings-description-field>
                {model.title.description}
              </div>
            </KeyValue>
          )}
        </Col>
        <Col md={6}>
          <KeyValue label={<FormattedMessage id="ui-eholdings.label.package" />}>
            <div data-test-eholdings-resource-show-package-name>
              <InternalLink to={`/eholdings/packages/${model.packageId}`}>
                {model.package.name}
              </InternalLink>
            </div>
          </KeyValue>

          {isTokenNeeded && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.package.tokenNeed" />}>
              <Button
                data-test-add-token-button
                marginBottom0
                to={`/eholdings/packages/${model.packageId}/edit`}
              >
                <FormattedMessage id="ui-eholdings.package.addToken" />
              </Button>
            </KeyValue>
          )}

          <KeyValue label={<FormattedMessage id="ui-eholdings.label.provider" />}>
            <div data-test-eholdings-resource-show-provider-name>
              <InternalLink to={`/eholdings/providers/${model.providerId}`}>
                {model.package.providerName}
              </InternalLink>
            </div>
          </KeyValue>

          {model.package.contentType && (
            <KeyValue label={<FormattedMessage id="ui-eholdings.resource.packageContentType" />}>
              <div data-test-eholdings-resource-show-content-type>
                {model.package.contentType}
              </div>
            </KeyValue>
          )}

          <KeyValue label={<FormattedMessage id="ui-eholdings.label.titleType" />}>
            <div
              data-test-eholdings-package-details-type
              data-testid="package-details-type"
            >
              {
                model.title.isTitleCustom
                  ? (<FormattedMessage id="ui-eholdings.custom" />)
                  : (<FormattedMessage id="ui-eholdings.managed" />)
              }
            </div>
          </KeyValue>

          <KeyValue label={<FormattedMessage id="ui-eholdings.label.peerReviewed" />}>
            <div
              data-test-eholdings-peer-reviewed-field
              data-testid="peer-reviewed-field"
            >
              {
                model.title.isPeerReviewed
                  ? (<FormattedMessage id="ui-eholdings.yes" />)
                  : (<FormattedMessage id="ui-eholdings.no" />)
              }
            </div>
          </KeyValue>
        </Col>
      </Row>
    </Accordion>
  );
};

ResourceInformation.propTypes = propTypes;

export default ResourceInformation;
