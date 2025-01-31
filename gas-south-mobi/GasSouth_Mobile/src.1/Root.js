import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';


import store from './store';
import Router from './Router';


export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <MenuProvider>
          <Router/>
        </MenuProvider>
      </Provider>
    );
  }
}