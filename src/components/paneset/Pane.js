import React, { Component, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { PaneHeader } from '@folio/stripes/components';
import css from './Pane.css';

const cx = classNames.bind(css);

export default class Pane extends Component {
  static propTypes = {
    // stripes builds all at once, so these are not foreign prop-types
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...PaneHeader.propTypes,

    // pane contents
    children: PropTypes.node,

    // additional pane classname
    className: PropTypes.string,

    // how much of the total available width this pane should take up
    flexGrow: PropTypes.number,

    // called when the vignette of non-static panes are clicked
    onDismiss: PropTypes.func,

    // animation callbacks
    onEnter: PropTypes.func,
    onEntered: PropTypes.func,
    onEntering: PropTypes.func,
    onExit: PropTypes.func,
    onExited: PropTypes.func,
    onExiting: PropTypes.func,

    // determines whether the pane content has padding
    padContent: PropTypes.bool,

    // used for panes which will always be visible. this is usually
    // just a single pane such as the results pane in search
    static: PropTypes.bool,

    // subheader
    subheader: PropTypes.node,

    // should be set to "aside" for panes that
    // animate from the opposite direction and are
    // only tangentially related to the main content (such as
    // navigation in settings, or filters in search)
    tagName: PropTypes.string,

    // toggles the pane visibility. when mounting for the first time,
    // the pane will mount in its desired state, only animating when
    // this prop is toggled
    visible: PropTypes.bool,
  };

  static defaultProps = {
    padContent: true,
    tagName: 'section',
    visible: true
  };

  state = {
    entered: this.props.visible
  };

  handleEntering = () => {
    const { onEntering } = this.props;

    this.setState({ entered: true }, () => {
      if (onEntering) onEntering();
    });
  };

  handleExiting = () => {
    const { onExiting } = this.props;

    this.setState({ entered: false }, () => {
      if (onExiting) onExiting();
    });
  };

  render() {
    const {
      actionMenu,
      appIcon,
      children,
      className,
      firstMenu,
      flexGrow, // eslint-disable-line no-unused-vars
      lastMenu,
      onDismiss,
      onEnter,
      onEntering, // eslint-disable-line no-unused-vars
      onEntered,
      onExit,
      onExiting, // eslint-disable-line no-unused-vars
      onExited,
      padContent,
      paneSub,
      paneTitle,
      paneTitleRef,
      static: isStatic,
      subheader,
      tagName,
      visible,
      ...rest
    } = this.props;
    const {
      entered
    } = this.state;

    const Element = tagName;
    const animDuration = 300;

    return (
      <Fragment>
        {!isStatic && (
          <CSSTransition
            mountOnEnter
            unmountOnExit
            in={visible}
            timeout={animDuration}
            classNames={{
              enter: css['fade-in'],
              enterActive: css['fade-in-active'],
              exit: css['fade-out'],
              exitActive: css['fade-out-active'],
            }}
          >
            <div
              className={cx('vignette', { aside: tagName === 'aside' })}
              onClick={onDismiss}
              aria-hidden="true"
              data-test-pane-vignette
            />
          </CSSTransition>
        )}

        <CSSTransition
          mountOnEnter
          unmountOnExit
          in={isStatic || visible}
          timeout={animDuration}
          onEnter={onEnter}
          onEntering={this.handleEntering}
          onEntered={onEntered}
          onExit={onExit}
          onExiting={this.handleExiting}
          onExited={onExited}
          classNames={{
            enter: css['pane-enter'],
            enterActive: css['pane-enter-active'],
            exit: css['pane-exit'],
            exitActive: css['pane-exit-active'],
          }}
        >
          <Element
            className={cx('pane', {
              aside: tagName === 'aside',
              static: isStatic
            }, className)}
            style={entered ? { flexGrow } : null}
            {...rest}
          >
            <div className={css['pane-container']}>
              {paneTitle && (
                <div data-test-pane-header>
                  <PaneHeader
                    paneTitle={paneTitle}
                    paneTitleRef={paneTitleRef}
                    paneSub={paneSub}
                    appIcon={appIcon}
                    firstMenu={firstMenu}
                    lastMenu={lastMenu}
                    actionMenu={actionMenu}
                  />
                </div>
              )}

              {subheader}

              <div
                className={cx('content', {
                  hasPadding: padContent
                })}
              >
                {children}
              </div>
            </div>
          </Element>
        </CSSTransition>
      </Fragment>
    );
  }
}
