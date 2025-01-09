import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import NormalHeader from '../../components/headers/NormalHeader';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import {Icon} from 'react-native-paper';

const width = Dimensions.get('window').width;

const AllVoucherScreen = ({navigation}) => {
  const [selectMenu, setSelectMenu] = useState(1);
  const selectedData =
    selectMenu === 1
      ? voucherData.delivery
      : selectMenu === 2
      ? voucherData.merchant
      : voucherData.takeAway;

  return (
    <View style={styles.container}>
      <NormalHeader
        title="Phiếu ưu đãi của bạn"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.menuContainer}>
        <TabMenu selectMenu={selectMenu} setSelectMenu={setSelectMenu} />
        <Body data={selectedData} />
      </View>
    </View>
  );
};

const TabMenu = ({selectMenu, setSelectMenu}) => {
  const tabs = [
    {index: 1, title: 'Giao hàng', count: voucherData.delivery.length},
    {index: 2, title: 'Tại cửa hàng', count: voucherData.merchant.length},
    {index: 3, title: 'Mang đi', count: voucherData.takeAway.length},
  ];

  return (
    <View style={styles.tabMenuContainer}>
      {tabs.map(({index, title, count}) => (
        <ItemTabMenu
          key={index}
          selectMenu={selectMenu}
          setSelectMenu={setSelectMenu}
          index={index}
          title={title}
          count={count}
        />
      ))}
    </View>
  );
};

const ItemTabMenu = ({selectMenu, setSelectMenu, index, title, count}) => (
  <TouchableOpacity onPress={() => setSelectMenu(index)} style={styles.tabItem}>
    <View style={styles.tabItemContent}>
      <Text
        style={[
          styles.tabTitle,
          {color: selectMenu === index ? colors.primary : null},
        ]}>
        {title}
      </Text>
      <Text style={styles.tabCount}>{count.toString()}</Text>
    </View>
    <View
      style={[
        styles.tabIndicator,
        {
          backgroundColor:
            selectMenu === index ? colors.primary : colors.gray300,
          height: selectMenu === index ? 2 : 1,
        },
      ]}
    />
  </TouchableOpacity>
);

const Body = ({data}) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyHeader}>
        {data.length > 0 ? 'Sẵn sàng sử dụng' : 'Hiện không có Voucher nào'}
      </Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <ItemVoucher item={item} />}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
      <View style={styles.itemDetails}></View>
    </View>
  </ScrollView>
);

const ItemVoucher = ({item}) => (
  <View style={styles.itemVoucher}>
    <Image source={{uri: item.image}} style={styles.itemImage} />
    <View style={styles.itemIcons}>
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
    </View>
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
      name: 'Voucher Giảm Giá 10%',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-03-20',
    },
    {
      id: 3,
      name: 'Voucher Tặng Quà Tặng',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-04-05',
    },
    {
      id: 4,
      name: 'Voucher Khuyến Mãi Lớn',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-05-10',
    },
    {
      id: 5,
      name: 'Voucher Giảm Giá 20%',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-06-12',
    },
    {
      id: 6,
      name: 'Voucher Miễn Phí Giao Hàng',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-07-15',
    },
    {
      id: 7,
      name: 'Voucher Tích Lũy Điểm',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      time: '2025-08-20',
    },
  ],
  merchant: [
    {
      id: 1,
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
    backgroundColor: colors.white,
    flex: 1,
  },
  menuContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  tabMenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
  },
  tabItem: {
    width: (width - GLOBAL_KEYS.PADDING_DEFAULT * 2) / 3,
    flexDirection: 'column',
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingBottom: GLOBAL_KEYS.PADDING_DEFAULT,
    flex: 1,
  },
  tabItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  tabCount: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    color: 'white',
    backgroundColor: colors.primary,
    textAlign: 'center',
    borderRadius: 7,
    width: 14,
    height: 14,
    lineHeight: 14,
    marginLeft: GLOBAL_KEYS.PADDING_SMALL / 2,
    fontWeight: '500',
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  bodyContainer: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  bodyHeader: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.black,
  },
  flatListContent: {
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  itemVoucher: {
    width: '100%',
    height: width / 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  itemImage: {
    width: width / 4,
    height: width / 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  itemIcons: {
    height: width / 3,
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    flex: 1,
    height: width / 3,
  },
  itemTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  itemTime: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
});

export default AllVoucherScreen;
