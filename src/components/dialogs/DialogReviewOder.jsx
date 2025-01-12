import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';
import { NormalText } from '../texts/NormalText';
import { Row } from '../containers/Row';
import { Column } from '../containers/Column';

const { height, width } = Dimensions.get('window');

const DialogReviewOderPropTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  item: PropTypes.object,  // Thêm prop để truyền dữ liệu item
};

export const DialogReviewOder = ({ isVisible, onHide, item }) => {
  if (!item) return null; 

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onHide}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <OverlayStatusBar />
          <KeyboardAvoidingView behavior="position">
            <ScrollView>
              <View style={styles.header}>
                <View style={styles.placeholderIcon} />
                <Text style={styles.titleText}>Trạng thái đơn hàng</Text>
                <TouchableOpacity onPress={onHide}>
                  <Icon
                    source="close"
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <View style={styles.bgImage}>
                    <Image
                        source={require('../../assets/images/ic_coffee_cup.png')}
                    />
                </View>
                <NormalText text='Thời gian giao dự kiến'/>
                <Text style={styles.statusText}>Hoàn tất</Text>
                <Row style={styles.support}>
                  <PrimaryButton title='Đánh giá' style={styles.btnSupport}/>
                  <PrimaryButton title='Gọi hỗ trợ' style={styles.btnSupport}/>
                </Row>
                <Text style={styles.detailText}>Thông tin đơn hàng</Text>
                <Row style={styles.detail}>
                  <Column style={styles.column}>
                    <NormalText text='Người nhận'/>
                    <Text>Nguyễn Văn A</Text>
                  </Column>
                  <Column style={{paddingVertical: GLOBAL_KEYS.PADDING_SMALL}}>
                    <NormalText text='Số điện thoại'/>
                    <Text>0987654321</Text>
                  </Column>
                </Row>
                <NormalText text='đặt tại bàn' style={styles.detail}/>
                <Column style={styles.detail}>
                  <NormalText text='Trạng thái thanh toán:'/>
                  <Row>
                    <NormalText text='PAID' style={styles.pay}/>
                    <Text>Đã thanh toán</Text>
                  </Row>
                </Column>
                <Column style={styles.detail}>
                <NormalText text='Mã đơn hàng:'/>
                  <Text>I923422332234</Text>
                </Column>
                <Text style={styles.detailText}>Sản phẩm đã chọn</Text>

                <PrimaryButton
                  title="Đóng"
                  onPress={onHide}
                  style={styles.closeButton}
                />
              </View>
              
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

DialogReviewOder.propTypes = DialogReviewOderPropTypes;

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
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
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
  btnSupport:{
    width: width/2.5
  },
  modalContent: {
    margin: 16,
  },
  modalItemText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  closeButton: {
    marginTop: 16,
    width: '80%',
  },
  bgImage:{
    backgroundColor: colors.green100,
    width: "100%",
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  statusText:{
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
  },
  support:{
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,

  },
  detailText:{
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    marginVertical: 12
  },
  detail:{
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL
  },
  column:{
    borderEndWidth: 1,
    borderColor: colors.gray200,
    width: "50%"
  },
  pay:{
    color: colors.white,
    backgroundColor: colors.green500,
  },
});
