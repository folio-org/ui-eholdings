/* eslint-disable jsx-a11y/interactive-supports-focus */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
  withStripes,
} from '@folio/stripes/core';
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

import KeyShortcutsWrapper from '../key-shortcuts-wrapper';

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
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  hasEditPermissions = () => {
    return this.props.stripes.hasPerm('ui-eholdings.settings.kb.edit');
  };

  handleKnowledgeBaseHeadingClick = (id) => {
    this.props.history.push({
      pathname: `/settings/eholdings/knowledge-base/${id}`,
    });
  };

  goToCreateKnowledgeBasePage = () => {
    this.props.history.push({
      pathname: '/settings/eholdings/knowledge-base/new',
    });
  };

  renderKnowledgeBaseHeading(configuration) {
    const { id, attributes: { name } } = configuration;

    return (
      <Tooltip
        id={`${id}-tooltip`}
        text="View details"
      >
        {({ ref, ariaIds }) => (
          <FormattedMessage id="ui-eholdings.settings.kb">
            {(message) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <span
                data-test-configuration-heading
                data-testid={`kb-credentials-heading-${id}`}
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

    return kbCredentials.map((configuration) => (
      <NavList
        aria-label={`${configuration.attributes.name}`}
        key={configuration.id}
      >
        <NavListSection
          label={this.renderKnowledgeBaseHeading(configuration)}
          activeLink={pathname}
        >
          <div className={css.listSectionContent}>
            <IfPermission perm="ui-eholdings.settings.root-proxy.view">
              <NavListItem to={`/settings/eholdings/${configuration.id}/root-proxy`}>
                <FormattedMessage id="ui-eholdings.settings.rootProxy" />
              </NavListItem>
            </IfPermission>

            <IfPermission perm="ui-eholdings.settings.custom-labels.view">
              <NavListItem to={`/settings/eholdings/${configuration.id}/custom-labels`}>
                <FormattedMessage id="ui-eholdings.resource.customLabels" />
              </NavListItem>
            </IfPermission>

            <IfPermission perm="ui-eholdings.settings.access-types.view">
              <NavListItem to={`/settings/eholdings/${configuration.id}/access-status-types`}>
                <FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />
              </NavListItem>
            </IfPermission>

            <IfPermission perm="ui-eholdings.settings.assignedUser.view">
              <NavListItem to={`/settings/eholdings/${configuration.id}/users`}>
                <FormattedMessage id="ui-eholdings.settings.assignedUsers" />
              </NavListItem>
            </IfPermission>

            <IfPermission perm="ui-eholdings.settings.usage-consolidation.view">
              <NavListItem to={`/settings/eholdings/${configuration.id}/usage-consolidation`}>
                <FormattedMessage id="ui-eholdings.settings.usageConsolidation" />
              </NavListItem>
            </IfPermission>
          </div>
        </NavListSection>
      </NavList>
    ));
  }

  renderLastMenu() {
    const {
      location: {
        pathname,
      },
    } = this.props;

    if (!this.hasEditPermissions()) {
      return null;
    }

    return (
      <Button
        id="create-knowledge-base-configuration"
        buttonStyle="primary"
        marginBottom0
        data-test-create-kb-configuration
        onClick={this.goToCreateKnowledgeBasePage}
        disabled={pathname === '/settings/eholdings/knowledge-base/new'}
      >
        <FormattedMessage id="ui-eholdings.settings.kb.newButton" />
      </Button>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <KeyShortcutsWrapper
        openCreateNewEntity={this.goToCreateKnowledgeBasePage}
      >
        <Pane
          data-test-eholdings-settings-pane
          defaultWidth="30%"
          paneTitle={
            <Headline margin="none">
              <FormattedMessage id="ui-eholdings.meta.title" />
            </Headline>
          }
          firstMenu={
            <PaneBackLink to="/settings" />
          }
          lastMenu={this.renderLastMenu()}
        >
          {this.renderKnowledgeBaseConfigurations()}
        </Pane>
        {children}
      </KeyShortcutsWrapper>
    );
  }
}

export default withRouter(withStripes(Settings));
