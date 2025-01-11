import React, {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import NormalHeader from '../../components/headers/NormalHeader';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import LightStatusBar from '../../components/status-bars/LightStatusBar';

const {width} = Dimensions.get('window');

const AllVoucherScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);

  const renderScene = SceneMap({
    delivery: () => <Body data={voucherData.delivery} />,
    merchant: () => <Body data={voucherData.merchant} />,
    takeAway: () => <Body data={voucherData.takeAway} />,
  });

  const routes = [
    {key: 'delivery', title: 'Giao hàng'},
    {key: 'merchant', title: 'Tại cửa hàng'},
    {key: 'takeAway', title: 'Mang đi'},
  ];

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Phiếu ưu đãi của bạn"
        onLeftPress={() => navigation.goBack()}
      />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width}}
        style={styles.tabView}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.indicatorStyle}
            activeColor={colors.primary}
            inactiveColor={colors.black}
            labelStyle={styles.labelStyle}
            activeLabelStyle={styles.activeLabelStyle}
            inactiveLabelStyle={styles.inactiveLabelStyle}
          />
        )}
      />
    </View>
  );
};

const Body = ({data}) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.bodyContainer}>
      {data.length > 0 && (
        <Text style={styles.bodyHeader}>Sẵn sàng sử dụng</Text>
      )}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <ItemVoucher item={item} />}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  </ScrollView>
);

const ItemVoucher = ({item}) => (
  <View style={styles.itemVoucher}>
    <Image source={{uri: item.image}} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemTime}>Hết hạn {item.time}</Text>
    </View>
  </View>
);

const voucherData = {
  delivery: [
    {
      id: 1,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-15',
    },
    {
      id: 2,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-15',
    },
    {
      id: 12,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-15',
    },
    {
      id: 13,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-15',
    },
    {
      id: 14,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-15',
    },
    {
      id: 15,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-15',
    },
    {
      id: 16,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-15',
    },
  ],
  merchant: [
    {
      id: 17,
      name: 'Voucher Giảm Giá 15%',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-02-25',
    },
  ],
  takeAway: [],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabView: {
    backgroundColor: colors.white,
  },
  tabBar: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  indicatorStyle: {
    backgroundColor: colors.primary,
  },
  labelStyle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    color: colors.black,
  },
  activeLabelStyle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    color: colors.primary,
  },
  inactiveLabelStyle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    color: colors.black,
  },
  bodyContainer: {
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  bodyHeader: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.black,
  },
  flatListContent: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  itemVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderWidth: 1,
    borderColor: colors.gray300,
    gap: GLOBAL_KEYS.GAP_DEFAULT * 2,
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: width / 4.5,
    flex: 1,
  },
  itemTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
    color: colors.black,
  },
  itemTime: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
  },
});

export default AllVoucherScreen;
