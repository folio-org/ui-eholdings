import React from 'react';
import { describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from 'enzyme';
import { MultiSelection } from '@folio/stripes-components';

import { mount } from '../../../test/bigtest/unitTestingUtils';
import Tags from './tags';

const baseProps = {
  tags: [],
  entityTags: [],
  model: {
    name: 'model',
    tags: { tagList: [] },
    id: 'id1',
    type: 'provider',
  },
  updateFolioTags: () => { },
  updateEntityTags: () => { },
};

describe('enzyme tests', () => {
  it('should render the root element', () => {
    const wrapper = shallow(<Tags {...baseProps} />);

    expect(wrapper.exists('[data-test-eholdings-details-tags]')).to.be.true;
  });

  it('should pass correct data options to the Multiselect', () => {
    const tags = [
      { id: '1', label: 'B' },
      { id: '2', label: 'A' },
    ];

    const wrapper = mount(
      <Tags
        {...baseProps}
        tags={tags}
      />
    );

    expect(wrapper.find(MultiSelection).props().dataOptions).to.deep.equal([
      { value: 'a', label: 'a' },
      { value: 'b', label: 'b' },
    ]);
  });

  it('should pass correct initial value the Multiselect', () => {
    const tags = [
      { id: '1', label: 'B' },
      { id: '2', label: 'A' },
    ];

    const entityTags = ['a'];

    const wrapper = mount(
      <Tags
        {...baseProps}
        entityTags={entityTags}
        tags={tags}
      />
    );

    expect(wrapper.find(MultiSelection).props().value).to.deep.equal([
      { value: 'a', label: 'a' },
    ]);
  });

  describe('when a tag that exists in the folio system was selected', () => {
    const tags = [
      { id: '1', label: 'Tag 1' },
      { id: '2', label: 'Tag 2' },
    ];

    const updateEntityTagsSpy = sinon.spy();
    const updateFolioTagsSpy = sinon.spy();

    const wrapper = mount(
      <Tags
        {...baseProps}
        tags={tags}
        updateEntityTags={updateEntityTagsSpy}
        updateFolioTags={updateFolioTagsSpy}
      />
    );

    wrapper
      .findWhere(el => el.text() === 'tag 2')
      .at(1)
      .simulate('click');

    it('should call the updateEntityTags callback', () => {
      expect(updateEntityTagsSpy.calledOnce).to.be.true;
    });

    it('should not call updateFolioTags callback', () => {
      expect(updateFolioTagsSpy.called).to.be.false;
    });
  });

  describe('when a tag that does not exist in the folio system was selected', () => {
    const folioTags = [];

    const updateEntityTagsSpy = sinon.spy();
    const updateFolioTagsSpy = sinon.spy();

    const wrapper = mount(
      <Tags
        {...baseProps}
        tags={folioTags}
        updateEntityTags={updateEntityTagsSpy}
        updateFolioTags={updateFolioTagsSpy}
      />
    );

    wrapper
      .find('input')
      .simulate('change', { target: { value: 'new tag' } })
      .simulate('keydown', { key: 'Enter' });

    it('should call the updateEntityTags callback with correct entity tags data', () => {
      expect(updateEntityTagsSpy.calledOnce).to.be.true;
      expect(updateEntityTagsSpy.firstCall.args).to.deep.equal([
        baseProps.model.type,
        {
          data: {
            type: 'tags',
            attributes: {
              name: baseProps.model.name,
              tags: {
                tagList: ['newtag']
              },
            },
          },
          id: baseProps.model.id,
        },
        `${baseProps.model.type}/${baseProps.model.id}`
      ]);
    });

    it('should call updateFolioTags callback with correct tag data', () => {
      expect(updateFolioTagsSpy.calledOnce).to.be.true;
      expect(updateFolioTagsSpy.firstCall.args[0]).to.deep.equal({
        label: 'newtag',
        description: 'newtag'
      });
    });
  });

  describe('when a tag was removed from the list of selected tags', () => {
    const folioTags = [
      { id: '1', label: 'tag1' },
      { id: '2', label: 'tag2' },
    ];

    const entityTags = ['tag1', 'tag2'];
    const model = { ...baseProps.model, tags: { tagList: entityTags } };

    const updateEntityTagsSpy = sinon.spy();
    const updateFolioTagsSpy = sinon.spy();

    const wrapper = mount(
      <Tags
        {...baseProps}
        model={model}
        tags={folioTags}
        entityTags={entityTags}
        updateEntityTags={updateEntityTagsSpy}
        updateFolioTags={updateFolioTagsSpy}
      />
    );

    wrapper
      .find('button[icon="times"]')
      .at(0)
      .simulate('click');

    it('should call updateEntityTags callback with correct tags data', () => {
      expect(updateEntityTagsSpy.calledOnce).to.be.true;
      expect(updateEntityTagsSpy.firstCall.args).to.deep.equal([
        baseProps.model.type,
        {
          data: {
            type: 'tags',
            attributes: {
              name: baseProps.model.name,
              tags: {
                tagList: ['tag2']
              },
            },
          },
          id: baseProps.model.id,
        },
        `${baseProps.model.type}/${baseProps.model.id}`
      ]);
    });

    it('should not call updateFolioTags callback', () => {
      expect(updateFolioTagsSpy.called).to.be.false;
    });
  });

  describe('when package tag list was updated', () => {
    const model = { ...baseProps.model, type: 'packages', contentType: 'e-book' };
    const folioTags = [
      { id: '1', label: 'Tag 1' },
      { id: '2', label: 'Tag 2' }
    ];

    const updateEntityTagsSpy = sinon.spy();
    const updateFolioTagsSpy = sinon.spy();

    const wrapper = mount(
      <Tags
        {...baseProps}
        model={model}
        tags={folioTags}
        updateEntityTags={updateEntityTagsSpy}
        updateFolioTags={updateFolioTagsSpy}
      />
    );

    wrapper
      .findWhere(el => el.text() === 'tag 2')
      .at(1)
      .simulate('click');

    it('should add contentType property to the package model', () => {
      expect(updateEntityTagsSpy.firstCall.args).to.deep.equal([
        model.type,
        {
          data: {
            type: 'tags',
            attributes: {
              contentType: 'e-book',
              name: model.name,
              tags: {
                tagList: ['tag 2']
              },
            },
          },
          id: baseProps.model.id,
        },
        `${model.type}/${model.id}`
      ]);
    });
  });
});
