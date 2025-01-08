import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import NormalHeader from '../../components/headers/NormalHeader';
import colors from '../../constants/color';

const width = Dimensions.get('window').width
const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: colors.white }]}>
        <Text>Tab 1 Content</Text>
    </View>
);

const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: colors.white }]}>
        <Text>Tab 2 Content</Text>
    </View>
);

const ThirdRoute = () => (
    <View style={[styles.scene, { backgroundColor: colors.white }]}>
        <Text>Tab 3 Content</Text>
    </View>
);

const OrderHistoryScreen = (props) => {
    const { navigation } = props;
    const [index, setIndex] = useState(0); // Chỉ mục tab đang được chọn
    const [routes] = useState([
        { key: 'first', title: 'Đang thực hiện' },
        { key: 'second', title: 'Đã hoàn thành' },
        { key: 'third', title: 'Đã hủy' },
    ]);

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
    });



    return (
        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Lịch sử đơn hàng' onLeftPress={() => navigation.goBack()} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: colors.primary, height: 2 }}
                        style={{ backgroundColor: colors.white }}
                        activeColor={colors.primary}
                        scrollEnabled={false}
                        inactiveColor={colors.gray700}
                        tabStyle={{ fontWeight: '400' }}


                    />

                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OrderHistoryScreen;