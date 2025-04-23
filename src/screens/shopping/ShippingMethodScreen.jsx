import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { MyBottomSheet } from '../../components/bottom-sheets/MyBottomSheet';
import { Row } from '../../components/containers/Row';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext, useCartContext } from '../../context';


const ShippingMethodScreen = () => {

  const {  authState } = useAppContext();
  const { cartState } = useCartContext();
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]
  const navigation = useNavigation()
  const options = React.useMemo(() => [
    {
      label: 'Giao hàng',
      image: require('../../assets/images/ic_delivery.png'),
      address: cartState
        ? cartState?.shippingAddressInfo?.location
        : 'Đang lấy vị trí...',
    },
    {
      label: 'Mang đi',
      image: require('../../assets/images/ic_take_away.png'),
      address: 'Đến lấy tại chi nhánh GreenZone',
    },
  ], [cartState]);


  const handleEditOption = option => {
    navigation.goBack()
    if (option === 'Giao hàng') {
      navigation.navigate(UserGraph.SelectAddressScreen, {
        isUpdateOrderInfo: true,
      });
    } else if (option === 'Mang đi') {
      navigation.navigate(BottomGraph.MerchantScreen, {
        isUpdateOrderInfo: true,
        fromHome: true,
      });
    }

  };
  const handleOptionSelect = async option => {
    setSelectedOption(option);
    navigation.goBack()
    try {
      if (option === 'Mang đi') {
        await CartManager.updateOrderInfo(cartDispatch, {
          deliveryMethod: DeliveryMethod.PICK_UP.value,
          store: cartState?.storeSelect,
          storeInfo: {
            storeName: cartState?.storeInfoSelect?.storeName,
            storeAddress: cartState?.storeInfoSelect?.storeAddress,
          },
        });
      } else if (option === 'Giao hàng') {
        await CartManager.updateOrderInfo(cartDispatch, {
          deliveryMethod: DeliveryMethod.DELIVERY.value,
          store: merchantLocal?._id,
          storeInfo: {
            storeName: merchantLocal?.name,
            storeAddress: merchantLocal?.storeAddress,
          },
        });
      }
    } catch (error) {
      console.log('Error', error)
    }
  };
  return (

    <MyBottomSheet
      visible={true}
      title='Chọn phương thức giao hàng'
      onHide={() => navigation.goBack()}
    >
      {options.map((option, index) => (
        <Pressable
          key={index}
          style={[
            styles.optionItem,
            selectedOption === option.label && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect(option.label)}>
          <Row style={styles.row}>
            <Row style={styles.row}>
              <View style={styles.iconContainer}>
                <Image
                  source={option.image}
                  style={[
                    option.label == 'Mang đi'
                      ? { width: 40, height: 40 }
                      : styles.icon,
                  ]}
                />
              </View>
              <Text style={styles.optionText}>{option.label}</Text>
            </Row>

            <Pressable onPress={() => handleEditOption(option.label)}>

              <Icon
                source="square-edit-outline"
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                color={colors.primary}
              />
            </Pressable>
          </Row>


          <Text style={styles.normalText}>
            {option.address}
          </Text>


          {option.label === 'Giao hàng' ? (
            <Text style={styles.phoneText}>
              {authState?.firstName
                ? authState?.firstName +
                ' ' +
                authState?.lastName +
                ' - ' +
                authState?.phoneNumber
                : null}
            </Text>
          ) : (
            <Text style={styles.phoneText}>
              {cartState?.storeInfoSelect?.storeAddress}
            </Text>
          )}
        </Pressable>
      ))}

    </MyBottomSheet>
  );
};
export default ShippingMethodScreen



const styles = StyleSheet.create({

  optionsContainer: {
    gap: GLOBAL_KEYS.GAP,
    backgroundColor: colors.gray200,
  },
  optionItem: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    gap: 4,
    paddingVertical: 8
  },
  selectedOption: {
    backgroundColor: colors.green100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'cover',
  },
  optionText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.black,
  },
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850,
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    textAlign: 'justify',
  },
  phoneText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '500',
  },
});
