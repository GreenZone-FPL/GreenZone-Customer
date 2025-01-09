import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import NormalHeader from '../../components/headers/NormalHeader';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import {Icon} from 'react-native-paper';

const width = Dimensions.get('window').width;

const AllVoucherScreen = props => {
  const {navigation} = props;
  const [selectMenu, setSelectMenu] = useState(1);

  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <NormalHeader
        title="Phiếu ưu đãi của bạn"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={{gap: GLOBAL_KEYS.GAP_DEFAULT}}>
        <TabMenu selectMenu={selectMenu} setSelectMenu={setSelectMenu} />
        <Body
          data={
            selectMenu === 1
              ? deliveryData
              : selectMenu === 2
              ? merchantData
              : data3
          }
        />
      </View>
    </View>
  );
};

const TabMenu = ({selectMenu, setSelectMenu}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.gray300,
      }}>
      <ItemTabMenu
        selectMenu={selectMenu}
        setSelectMenu={setSelectMenu}
        index={1}
        title="Giao hàng"
        count={deliveryData.length}
      />
      <ItemTabMenu
        selectMenu={selectMenu}
        setSelectMenu={setSelectMenu}
        index={2}
        title="Tại cửa hàng"
        count={2}
      />
      <ItemTabMenu
        selectMenu={selectMenu}
        setSelectMenu={setSelectMenu}
        index={3}
        title="Mang đi"
        count={0}
      />
    </View>
  );
};

const ItemTabMenu = ({selectMenu, setSelectMenu, index, title, count}) => (
  <TouchableOpacity
    onPress={() => setSelectMenu(index)}
    style={{
      width: (width - GLOBAL_KEYS.PADDING_DEFAULT * 2) / 3,
      flexDirection: 'column',
      paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
      paddingBottom: GLOBAL_KEYS.PADDING_DEFAULT,
      flex: 1,
    }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
          fontWeight: '500',
          color: selectMenu === index ? colors.primary : null,
        }}>
        {title}
      </Text>
      <Text
        style={{
          fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
          color: 'white',
          backgroundColor: colors.primary,
          textAlign: 'center',
          borderRadius: 7,
          width: 14, //bằng fontSizeDefault
          height: 14, //bằng fontSizeDefault
          lineHeight: 14,
          marginLeft: GLOBAL_KEYS.PADDING_SMALL / 2,
          fontWeight: '500',
        }}>
        {count.toString()}
      </Text>
    </View>
    {index == selectMenu ? (
      <View
        style={{
          height: 2,
          width: '100%',
          backgroundColor: colors.primary,
          position: 'absolute',
          bottom: 0,
        }}
      />
    ) : (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: colors.gray300,
          position: 'absolute',
          bottom: 0,
        }}
      />
    )}
  </TouchableOpacity>
);

const Body = ({data}) => {
  return (
    <View
      style={{
        marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        gap: GLOBAL_KEYS.GAP_DEFAULT,
      }}>
      <Text
        style={{
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
          fontWeight: 'bold',
          color: colors.black,
        }}>
        {data.length > 0 ? 'Sẵn sàng sử dụng' : 'Hiện không có Voucher nào'}
      </Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <ItemVoucher item={item} />}
        contentContainerStyle={{gap: GLOBAL_KEYS.GAP_SMALL}}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const ItemVoucher = ({item}) => (
  <View
    style={{
      width: '100%',
      height: width / 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
      backgroundColor: colors.white,
      padding: GLOBAL_KEYS.PADDING_DEFAULT,
      shadowColor: colors.black,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 5,
      gap: GLOBAL_KEYS.GAP_DEFAULT,
    }}>
    <Image
      source={{uri: item.image}}
      style={{
        width: width / 4,
        height: width / 4,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
      }}
    />
    <View
      style={{
        height: width / 3,
        flexDirection: 'column',
        gap: GLOBAL_KEYS.GAP_SMALL,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
      <Icon source="checkbox-blank-circle" color={colors.gray300} />
    </View>
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        flex: 1,
        height: width / 3,
      }}>
      <Text
        style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500'}}>
        {item.name}
      </Text>
      <Text
        style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500'}}>
        Hết hạn {item.time}
      </Text>
    </View>
  </View>
);
const deliveryData = [
  {
    id: 1,
    name: 'Voucher Giao Hàng Miễn Phí',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-01-10',
  },
  {
    id: 2,
    name: 'Voucher Giảm Giá 10%',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-02-15',
  },
  {
    id: 3,
    name: 'Voucher Tặng Quà Tặng',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-03-01',
  },
  {
    id: 4,
    name: 'Voucher Khuyến Mãi Lớn',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-04-05',
  },
  {
    id: 5,
    name: 'Voucher Giảm Giá 20%',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-05-10',
  },
  {
    id: 6,
    name: 'Voucher Miễn Phí Vận Chuyển',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-06-12',
  },
  {
    id: 7,
    name: 'Voucher Tích Lũy Điểm',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-07-20',
  },
];
const merchantData = [
  {
    id: 1,
    name: 'Voucher Giao Hàng Miễn Phí',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-01-10',
  },
  {
    id: 2,
    name: 'Voucher Giảm Giá 10%',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
    time: '2025-02-15',
  },
];

const data3 = [];
export default AllVoucherScreen;
