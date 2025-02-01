import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import hoistStatics from 'hoist-non-react-statics';
import OfflineScreen from '../components/App/OfflineScreen';

function withNetInfo(WrappedComponent) {
  class ExtendedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.handleChange = this.handleChange.bind(this);
      NetInfo.isConnected.fetch().then(this.handleChange);
    }

    componentWillMount() {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleChange);
    }

    componentWillUnmount() {
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleChange);
    }

    handleChange(isConnected) {
      this.setState({ isConnected });
    }

    render() {
      const {isConnected} = this.state;
      if(isConnected === undefined){
          return null;
      }
      if(isConnected === false){
          return <OfflineScreen/>;
      }
      return <WrappedComponent isConnected={this.state.isConnected} {...this.props} />;
    }
  }
  return hoistStatics(ExtendedComponent, WrappedComponent);
}

export default withNetInfo;