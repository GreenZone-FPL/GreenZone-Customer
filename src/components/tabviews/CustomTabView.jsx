import { Tab, TabView } from '@rneui/themed';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, GLOBAL_KEYS } from '../../constants';

const CustomTabViewPropTypes = {
  tabIndex: PropTypes.number,
  setTabIndex: PropTypes.func,
  tabBarConfig: PropTypes.shape({
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    titleStyle: PropTypes.object,
    indicatorStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    tabItemContainerStyle: PropTypes.object,
    titleActiveColor: PropTypes.string,
    titleInActiveColor: PropTypes.string,
    scrollable: PropTypes.bool,
  }),
  tabViewConfig: PropTypes.shape({
    tabViewContainerStyle: PropTypes.object,
    tabViewItemStyle: PropTypes.object,
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

/**
 *
 * Usage example
 *  <CustomTabView
      tabIndex={tabIndex}
      setTabIndex={setTabIndex}
      tabBarConfig={{
        titles: ['Tab A', 'Tab B', 'Tab C'],
        titleActiveColor: colors.primary,
        titleInActiveColor: colors.gray700,
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
 */

export const CustomTabView = ({
  tabIndex = 0,
  setTabIndex = () => { },
  tabBarConfig = {
    titles: ['Tab 1', 'Tab 2', 'Tab 3'],
    titleStyle: {},
    indicatorStyle: {},
    tabItemContainerStyle: {},
    titleActiveColor: colors.primary,
    titleInActiveColor: colors.gray700,
    scrollable: false,
    containerStyle: {backgroundColor: colors.white}
  },
  tabViewConfig = {
    tabViewContainerStyle: {},
    tabViewItemStyle: {},
  },
  children,
}) => {
  return (

    <>
      <Tab
        value={tabIndex}
        style={tabBarConfig.containerStyle}
        onChange={e => setTabIndex(e)}
        indicatorStyle={[styles.indicatorStyle, tabBarConfig.indicatorStyle]}
        variant="secondary"
        scrollable={true}>
        {tabBarConfig.titles.map((title, index) => {
          return (
            <Tab.Item
              key={`tab-item-${index}`} // Thêm key tại đây
              title={title}
              titleStyle={[
                styles.titleStyle,
                {
                  color:
                    index === tabIndex
                      ? tabBarConfig.titleActiveColor
                      : tabBarConfig.titleInActiveColor,
                },
                tabBarConfig.titleStyle, 
              ]}
              
              containerStyle={[
                styles.tabItemContainer,
                tabBarConfig.tabItemContainerStyle,
              ]}
            />
          );
        })}
      </Tab>

      {/* TabView configuration */}
      <TabView
        value={tabIndex}
        onChange={setTabIndex}
        animationType="spring"
        containerStyle={[
          styles.tabViewContainer,
          tabViewConfig.tabViewContainerStyle,
        ]}>
        {children &&
          React.Children.map(children, (child, index) => (
            <TabView.Item
              key={index}
              style={[styles.tabViewItem, tabViewConfig.tabViewItemStyle]}>
              {index === tabIndex && child}
            </TabView.Item>
          ))}
      </TabView>

    </>
  );
};

CustomTabView.propTypes = CustomTabViewPropTypes;

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 3,
  },
  tabItemContainer: {
    backgroundColor: colors.white,

  },
  tabViewContainer: {
    backgroundColor: colors.white,
  },
  tabViewItem: {
    backgroundColor: colors.white,
    width: '100%',
  },
  titleStyle: {
    color: colors.gray700,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,

  },
});
