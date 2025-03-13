import React, { useState } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../constants';


export const MyTabView = ({ routes, scenes, initialIndex = 0, renderTabBar }) => {
    const [index, setIndex] = useState(initialIndex);
  
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap(scenes)}
        onIndexChange={setIndex}
        initialLayout={{ width: 400 }}
        style={{ backgroundColor: 'white' }}
        lazy={true}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: 'white' }}
            indicatorStyle={{
              backgroundColor: colors.primary, // Màu của indicator
            }}
            labelStyle={{
              textTransform: 'none',  // Không in hoa
              fontSize: 12,  // Đổi fontSize tại đây
              color: index === 0 ? colors.primary : 'gray', // Màu chữ của tab đang được chọn
            }}
            activeColor={colors.primary} // Màu chữ khi tab được chọn
            inactiveColor="gray" // Màu chữ khi tab không được chọn
            {...renderTabBar && renderTabBar(props)} // Nếu có, sử dụng renderTabBar từ bên ngoài
          />
        )}
      />
    );
  };
  
  




