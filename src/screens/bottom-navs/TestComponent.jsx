import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomTabView } from '../../components';
import { colors } from '../../constants';


const TestComponent = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <>
      <CustomTabView
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        tabBarConfig={{
          titles: ['Tab A', 'Tab B', 'Tab C'],
        }}
      >
        <View>
          <Text>Đây là nội dung của Tab A</Text>
        </View>

        <View>
          <Text>Đây là nội dung của Tab B</Text>
        </View>

        <View>
          <Text>Đây là nội dung của Tab C</Text>
        </View>
        
      </CustomTabView>
    </>
  );
};

// Stylesheet for the component
const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 3,
  },
  tabContainer: {
    backgroundColor: 'white',
  },
  tabItemContainer: {
    backgroundColor: 'white',
  },
  tabViewContainer: {
    backgroundColor: 'white',
  },
  tabViewItem: {
    backgroundColor: 'white',
    width: '100%',
  },
});

export default TestComponent
