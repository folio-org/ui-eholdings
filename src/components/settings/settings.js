/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Headline,
  NavList,
  NavListItem,
  NavListSection,
  PaneBackLink,
  Pane,
  Tooltip,
  Button,
} from '@folio/stripes/components';

import { isKnowledgeBaseConfigured } from '../utilities';

import css from './settings.css';

class Settings extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    kbCredentials: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        apiKey: PropTypes.string.isRequired,
        customerId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
      id: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        createdByUserId: PropTypes.string.isRequired,
        createdByUsername: PropTypes.string.isRequired,
        createdDate: PropTypes.string.isRequired,
        updatedByUserId: PropTypes.string,
        updatedDate: PropTypes.string,
      }),
      type: PropTypes.string.isRequired,
    })).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  }

  handleKnowledgeBaseHeadingClick = (id) => {
    this.props.history.push(`/settings/eholdings/knowledge-base/${id}`);
  }

  renderKnowledgeBaseHeading(configuration) {
    const { id, attributes: { name } } = configuration;

    return (
      <Tooltip
        text="View details"
      >
        {({ ref, ariaIds }) => (
          <FormattedMessage id="ui-eholdings.settings.kb">
            {(message) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <span
                data-test-configuration-heading
                ref={ref}
                role="button"
                className={css.listSectionHeader}
                aria-labelledby={ariaIds.text}
                aria-describedby={ariaIds.sub}
                onClick={() => this.handleKnowledgeBaseHeadingClick(id)}
              >
                {name || message}
              </span>
            )}
          </FormattedMessage>
        )}
      </Tooltip>
    );
  }

  renderKnowledgeBaseConfigurations() {
    const {
      location: { pathname },
      kbCredentials,
    } = this.props;

    return kbCredentials.map((configuration) => {
      const knowledgeBaseConfigured = isKnowledgeBaseConfigured(configuration);

      return (
        <NavList>
          <NavListSection
            label={this.renderKnowledgeBaseHeading(configuration)}
            activeLink={pathname}
          >
            <div className={css.listSectionContent}>
              <IfPermission perm="ui-eholdings.settings.root-proxy">
                <NavListItem
                  to={`/settings/eholdings/${configuration.id}/root-proxy`}
                  isDisabled={!knowledgeBaseConfigured}
                >
                  <FormattedMessage id="ui-eholdings.settings.rootProxy" />
                </NavListItem>
              </IfPermission>

              <NavListItem
                to={`/settings/eholdings/${configuration.id}/custom-labels`}
                isDisabled={!knowledgeBaseConfigured}
              >
                <FormattedMessage id="ui-eholdings.resource.customLabels" />
              </NavListItem>

              <NavListItem
                to={`/settings/eholdings/${configuration.id}/access-status-types`}
                isDisabled={!knowledgeBaseConfigured}
              >
                <FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />
              </NavListItem>
              <NavListItem
                to={`/settings/eholdings/${configuration.id}/users`}
                isDisabled={!knowledgeBaseConfigured}
              >
                <FormattedMessage id="ui-eholdings.settings.assignedUsers" />
              </NavListItem>
            </div>
          </NavListSection>
        </NavList>
      );
    });
  }

  renderLastMenu() {
    const { location: { pathname } } = this.props;

    return (
      <Button
        id="create-knowledge-base-configuration"
        marginBottom0
        data-test-create-kb-configuration
        to={{
          pathname: '/settings/eholdings/knowledge-base/new',
          state: { eholdings: true }
        }}
        disabled={pathname === '/settings/eholdings/knowledge-base/new'}
      >
        <FormattedMessage id="ui-eholdings.settings.kb.new" />
      </Button>
    );
  }

  render() {
    const {
      children,
      location: { pathname },
    } = this.props;

    return (
      <>
        <Pane
          data-test-eholdings-settings-pane
          defaultWidth="30%"
          paneTitle={
            <Headline tag="h3" margin="none">
              <FormattedMessage id="ui-eholdings.meta.title" />
            </Headline>
          }
          firstMenu={
            <PaneBackLink to="/settings" />
          }
          lastMenu={this.renderLastMenu()}
        >
          {this.renderKnowledgeBaseConfigurations()}
          {pathname === '/settings/eholdings/knowledge-base/new' && (
            <FormattedMessage id="ui-eholdings.settings.kb">
              {label => (
                <NavList ariaLabel={label}>
                  <NavListSection
                    label={label}
                    activeLink={pathname}
                  >
                    <div className={css.listSectionContent}>
                      <NavListItem className={css.listItemDisabled}>
                        <FormattedMessage id="ui-eholdings.settings.rootProxy" />
                      </NavListItem>

                      <NavListItem className={css.listItemDisabled}>
                        <FormattedMessage id="ui-eholdings.resource.customLabels" />
                      </NavListItem>

                      <NavListItem className={css.listItemDisabled}>
                        <FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />
                      </NavListItem>
                      <NavListItem className={css.listItemDisabled}>
                        <FormattedMessage id="ui-eholdings.settings.assignedUsers" />
                      </NavListItem>
                    </div>
                  </NavListSection>
                </NavList>
              )}
            </FormattedMessage>
          )}
        </Pane>
        {children}
      </>
    );
  }
}

export default withRouter(Settings);
