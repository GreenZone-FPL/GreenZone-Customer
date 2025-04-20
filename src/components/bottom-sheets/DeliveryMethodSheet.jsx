import PropTypes from 'prop-types';
import React from 'react';
import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-paper';
import {DeliveryMethod, GLOBAL_KEYS, colors} from '../../constants';
import {Column} from '../containers/Column';
import {Row} from '../containers/Row';
import {OverlayStatusBar} from '../status-bars/OverlayStatusBar';

const DeliveryMethodSheetPropTypes = {
  visible: PropTypes.bool.isRequired,
  selectedOption: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onOptionSelect: PropTypes.func,
};

export const DeliveryMethodSheet = ({
  visible,
  selectedOption,
  onClose,
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <OverlayStatusBar />
          <Row style={styles.header}>
            <View style={styles.placeholderIcon} />
            <Text style={styles.titleText}>Chọn phương thức đặt hàng</Text>

            <Pressable onPress={onClose}>
              <Icon
                source="close"
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                color={colors.primary}
              />
            </Pressable>
          </Row>

          <Column style={styles.optionsContainer}>
            <Pressable
              style={[
                styles.optionItem,
                selectedOption.label === DeliveryMethod.PICK_UP.label &&
                  styles.selectedOption,
              ]}
              onPress={() => onSelect(DeliveryMethod.PICK_UP)}>
              <View style={styles.containerImage}>
                <Image
                  source={require('../../assets/images/ic_take_away.png')}
                  style={styles.icon}
                />
              </View>

              <Text style={styles.optionText}>
                {DeliveryMethod.PICK_UP.label}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.optionItem,
                selectedOption.label === DeliveryMethod.DELIVERY.label &&
                  styles.selectedOption,
              ]}
              onPress={() => onSelect(DeliveryMethod.DELIVERY)}>
              <View style={styles.containerImage}>
                <Image
                  source={require('../../assets/images/ic_delivery.png')}
                  style={styles.icon1}
                />
              </View>
              <Text style={styles.optionText}>
                {DeliveryMethod.DELIVERY.label}
              </Text>
            </Pressable>
          </Column>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

DeliveryMethodSheet.propTypes = DeliveryMethodSheetPropTypes;

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
    shadowOffset: {width: 0, height: 4},
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
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  optionsContainer: {
    gap: GLOBAL_KEYS.GAP,
    backgroundColor: colors.gray200,
  },
  optionItem: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: colors.green100,
  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: 'cover',
  },
  icon1: {
    width: 36,
    height: 36,
    resizeMode: 'cover',
  },
  optionText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
  },
  containerImage: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
