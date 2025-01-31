import React, { Component } from 'react';
import { Text, LogBox } from 'react-native'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';

import { store, persistor } from './store';
import Router from './Router';
import SplashScreen from './screens/SplashScreen';
import addLocalCyclinder from './api/addLocalCyclinder';
import { TailwindProvider } from 'tailwind-rn';
import utilities from '../tailwind.json';
import { NativeBaseProvider } from "native-base";
import TEST from './screens/DriverOtherGasCylinder';

export default class Root extends Component {

    state = {
        isChange: false
    }

    async componentDidMount() {

        setTimeout(() => {
            this.setState({ isChange: true })
        }, 2000)
        // await addLocalCyclinder.removeItem();
    }


    render() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`', 'Warning: componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.'])
        return (
            <Provider store={store}>
                <TailwindProvider utilities={utilities}>
                    <NativeBaseProvider>
                        <PersistGate loading={null} persistor={persistor}>
                            {this.state.isChange ? <Router /> : <SplashScreen />}
                            {/* {this.state.isChange ? <TEST /> : <SplashScreen />} */}
                        </PersistGate>
                    </NativeBaseProvider>
                </TailwindProvider>
            </Provider>
        );
    }
}