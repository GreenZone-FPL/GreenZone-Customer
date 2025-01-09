import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import NormalHeader from '../../components/headers/NormalHeader';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';

const width = Dimensions.get('window').width;

const AllVoucherScreen = props => {
  const {navigation} = props;
  const [selectMenu, setSelectMenu] = useState(1);

  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
        gap: GLOBAL_KEYS.GAP_DEFAULT,
      }}>
      <NormalHeader
        title="Phiếu ưu đãi của bạn"
        onLeftPress={() => navigation.goBack()}
      />
      <TabMenu selectMenu={selectMenu} setSelectMenu={setSelectMenu} />
      <Body selectMenu={selectMenu} />
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
        count={4}
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

const Body = ({selectMenu}) => {
  return (
    <View>
      <Text
        style={{
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
          fontWeight: 'bold',
          color: colors.black,
        }}>
        Sẵn sàng sử dụng
      </Text>
    </View>
  );
};
const data = {};
export default AllVoucherScreen;
