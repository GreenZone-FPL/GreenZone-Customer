import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { MyBottomSheet } from '../bottom-sheets/MyBottomSheet';
import { Row } from '../containers/Row';
import { useCartContext } from '../../context'

const DialogShippingMethodPropTypes = {
  visible: PropTypes.bool.isRequired,
  selectedOption: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  onEditOption: PropTypes.func,
  onOptionSelect: PropTypes.func,
};

export const DialogShippingMethod = ({
  visible,
  selectedOption,
  onHide,
  onEditOption,
  onOptionSelect,
}) => {

  const { authState } = useAppContext();
  const { cartState } = useCartContext();


  const location = cartState?.shippingAddressInfo?.location;

  const options = React.useMemo(() => [
    {
      label: 'Giao hàng',
      image: require('../../assets/images/ic_delivery.png'),
      address: location ?? 'Đang lấy vị trí...',
    },
    {
      label: 'Mang đi',
      image: require('../../assets/images/ic_take_away.png'),
      address: 'Đến lấy tại chi nhánh GreenZone',
    },
  ], [location]);



  return (


    <MyBottomSheet
      visible={visible}
      title='Chọn phương thức giao hàng'
      onHide={onHide}
    >
      {options.map((option, index) => (
        <Pressable
          key={index}
          style={[
            styles.optionItem,
            selectedOption === option.label && styles.selectedOption,
          ]}
          onPress={() => onOptionSelect(option.label)}>
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

            <Pressable onPress={() => onEditOption(option.label)}>

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

DialogShippingMethod.propTypes = DialogShippingMethodPropTypes;

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
