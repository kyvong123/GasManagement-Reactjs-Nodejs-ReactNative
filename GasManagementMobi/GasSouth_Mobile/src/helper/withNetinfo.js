import React, { Component } from "react";
//import { NetInfo } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import hoistStatics from "hoist-non-react-statics";
import OfflineScreen from "../components/OfflineScreen";

function withNetInfo(WrappedComponent) {
  class ExtendedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.handleChange = this.handleChange.bind(this);
      NetInfo.fetch().then(this.handleChange);
    }

    // componentWillMount() {
    //   NetInfo.addEventListener(
    //     "connectionChange",
    //     this.handleChange
    //   );
    // }

    componentWillUnmount() {
    NetInfo.addEventListener(()=>{
      "connectionChange",
      this.handleChange
    });
    }

    //  unsubscribe = NetInfo.removeEventListener(
    //   ()=>{
    //     "connectionChange",
    //     this.handleChange
    //   }
    

    handleChange(isConnected) {
      this.setState({ isConnected });
    }

    render() {
      const { isConnected } = this.state;
      if  (isConnected === undefined) {
        return null;
      }
      if  (isConnected === false) {
        return <OfflineScreen />;
      }
      return (
        <WrappedComponent
          isConnected={this.state.isConnected}
          {...this.props}
        />
      );
    }
  }
  return hoistStatics(ExtendedComponent, WrappedComponent);
}

export default withNetInfo;

