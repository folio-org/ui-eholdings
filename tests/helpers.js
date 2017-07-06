/* global beforeEach, afterEach */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';

import App from '../src/components/app';

// use enzyme matchers
chai.use(chaiEnzyme());

export function setupAppForAcceptanceTesting() {
  let rootElement;

  beforeEach(function() {
    rootElement = document.createElement('div');
    rootElement.id = 'react-testing';
    document.body.appendChild(rootElement);

    this.wrapper = mount(<App/>, {
      attachTo: rootElement
    });
  });

  afterEach(function() {
    this.wrapper.detach();
    document.body.removeChild(rootElement);
    rootElement = null;
  });
}
