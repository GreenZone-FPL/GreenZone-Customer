import PropTypes from 'prop-types';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';
import {Column} from '../containers/Column'
import {Row} from '../containers/Row'

const DialogNotificationPropTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string,
  address: PropTypes.string,
  time: PropTypes.string,
  merchant: PropTypes.string,
  onConfirm: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};


export const DialogNotification = ({ isVisible, onHide, title, style, address , time, merchant, onConfirm}) => {

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onHide}>
      <Column style={styles.overlay}>
        <Column style={[styles.modalContainer, style]}>
          <OverlayStatusBar />
          <ScrollView>
            <KeyboardAvoidingView>
              <Row style={styles.header}>
                <Text style={styles.titleText}>{title}</Text>
              </Row>
              <Column style={styles.body}>
                <Text style={styles.textOrder}>Đơn hàng tự đến lấy sẽ được giao tới {address} vào {time} tại {merchant}</Text>
              </Column>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.textBtn} onPress={onHide}>Thay đổi thông tin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={onConfirm}>
                <Text style={styles.textBtn}>Xác nhận</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        </Column>
      </Column>
    </Modal>
  );
};

DialogNotification.propTypes = DialogNotificationPropTypes;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: colors.white,
    width: '70%',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingTop:  GLOBAL_KEYS.PADDING_DEFAULT,
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    backgroundColor: colors.transparent,
  },
  body: {
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT
  },
  textOrder:{
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  btn:{
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: GLOBAL_KEYS.PADDING_DEFAULT, 
    borderColor: colors.green600
  },
  textBtn:{
    textAlign:'center',
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE
  }
});