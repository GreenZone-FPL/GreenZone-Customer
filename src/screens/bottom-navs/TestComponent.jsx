import React from 'react';
import { Tab, Text, TabView } from '@rneui/themed';
import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../constants';
import { NormalText } from '../../components';

const width = Dimensions.get('window').width;

const TestComponent = () => {
  const [index, setIndex] = React.useState(0);

  return (
    <>
      {/* Tab configuration */}
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={styles.indicatorStyle}
        containerStyle={[styles.tabContainer, { width: width }]}
        variant="primary"
        scrollable={false}
      >
        <Tab.Item
          title="Recent"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 0 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
        <Tab.Item
          title="Favorite"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 1 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
        <Tab.Item
          title="Cart"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 2 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
      </Tab>

      {/* TabView configuration */}
      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        containerStyle={styles.tabViewContainer}
      >
        <TabView.Item style={styles.tabViewItem}>
          <Text h1>Recent</Text>
        </TabView.Item>

        <TabView.Item style={styles.tabViewItem}>
          <Text h1>Favorite</Text>
        </TabView.Item>
        
        <TabView.Item style={styles.tabViewItem}>
          <NormalText text="Cart" />
        </TabView.Item>
      </TabView>
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

export default TestComponent;
