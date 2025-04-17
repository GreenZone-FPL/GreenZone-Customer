import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';

const DialogShippingMethodPropTypes = {
  isVisible: PropTypes.bool.isRequired,
  selectedOption: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  onEditOption: PropTypes.func,
  onOptionSelect: PropTypes.func,
};

export const DialogShippingMethod = ({
  isVisible,
  selectedOption,
  onHide,
  onEditOption,
  onOptionSelect,
}) => {

  const { cartState, authState } = useAppContext();

  const options = [
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
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onHide}>
      <Pressable style={styles.overlay} onPress={onHide}>
        <Pressable style={styles.modalContainer} onPress={() => { }}>
          <OverlayStatusBar />
          <View style={styles.header}>
            <View style={styles.placeholderIcon} />
            <Text style={styles.titleText}>Chọn phương thức đặt hàng</Text>
            <TouchableOpacity onPress={onHide}>
              <Icon
                source="close"
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.optionItem,
                  selectedOption === option.label && styles.selectedOption,
                ]}
                onPress={() => onOptionSelect(option.label)}>
                <View style={styles.row}>
                  <View style={styles.row}>
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
                  </View>

                  <Pressable onPress={() => onEditOption(option.label)}>
                    <Icon
                      source="square-edit-outline"
                      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                      color={colors.primary}
                    />
                  </Pressable>
                </View>
                <Text numberOfLines={1} style={styles.normalText}>
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
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

DialogShippingMethod.propTypes = DialogShippingMethodPropTypes;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray200,
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    backgroundColor: colors.transparent,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    flex: 1,
  },
  optionsContainer: {
    gap: GLOBAL_KEYS.GAP,
    backgroundColor: colors.gray200,
  },
  optionItem: {
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    gap: 4,
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
