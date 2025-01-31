import React from 'react';
import { Text } from 'react-native';
import {BaseLightbox} from '../../components/Common';


const DemoLightbox = () => (
  <BaseLightbox verticalPercent={0.5} horizontalPercent={0.9}>
    <Text>Demo Lightbox</Text>
    <Text>Allows transparency for background</Text>
  </BaseLightbox>
);

export default DemoLightbox; 