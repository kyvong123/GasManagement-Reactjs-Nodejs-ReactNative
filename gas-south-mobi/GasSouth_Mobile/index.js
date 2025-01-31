/** @format */

//use node 16.20

import { AppRegistry } from 'react-native';
import Root from './src/Root';
import { name as appName } from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(Root));
