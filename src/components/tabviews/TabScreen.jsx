import React from 'react';
import { View, Text } from 'react-native';
import {MyTabView} from './MyTabView';

const FirstRoute = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Đây là tab 1</Text>
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Đây là tab 2</Text>
  </View>
);

const TabScreen = () => {
  const routes = [
    { key: 'first', title: 'Tab 1' },
    { key: 'second', title: 'Tab 2' },
  ];

  const scenes = {
    first: FirstRoute,
    second: SecondRoute,
  };


  return (
    <MyTabView
      routes={routes}
      scenes={scenes}
      initialIndex={0}
    />
  );
};

export default TabScreen;
