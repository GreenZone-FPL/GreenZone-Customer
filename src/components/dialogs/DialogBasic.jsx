import PropTypes from 'prop-types';
import React, { useState } from 'react';
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

const DialogBasicPropTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};


export const DialogBasic = ({ isVisible, onHide, title , children}) => {

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onHide}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <OverlayStatusBar />
            <ScrollView>
              <KeyboardAvoidingView>

              
              <View style={styles.header}>
                <View style={styles.placeholderIcon} />
                <Text style={styles.titleText}>{title}</Text>
                <TouchableOpacity onPress={onHide}>
                  <Icon
                    source="close"
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.body}>
                {children}
              </View>
              </KeyboardAvoidingView>
            </ScrollView>
        </View>
      </View> 
    </Modal>
  );
};

DialogBasic.propTypes = DialogBasicPropTypes;

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
  body:{
    flexDirection: 'column',
    margin: 14,
    gap: GLOBAL_KEYS.GAP_SMALL,
  }
});