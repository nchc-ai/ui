import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import Enzyme, { shallow, render } from 'enzyme';
const $ = require('cheerio');

import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';

global.React = React;
global.render = render;
global.shallow = shallow;
global.toJson = toJson;
global.$ = $;

global.nock = nock;
global.configureMockStore = configureMockStore;
global.createEpicMiddleware = createEpicMiddleware;

Enzyme.configure({ adapter: new Adapter() });
