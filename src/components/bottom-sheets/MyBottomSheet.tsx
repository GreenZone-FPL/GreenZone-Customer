import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {GLOBAL_KEYS, colors} from '../../constants';
import {Column} from '../containers/Column';
import {Row} from '../containers/Row';
import {OverlayStatusBar} from '../status-bars/OverlayStatusBar';

interface MyBottomSheetProps {
  visible: boolean;
  onHide: () => void;
  title?: string;
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  styleBody?: ViewStyle | ViewStyle[];
  titleStyle?: TextStyle;
}

export const MyBottomSheet: React.FC<MyBottomSheetProps> = ({
  visible,
  onHide,
  title,
  children,
  style,
  titleStyle
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <Pressable style={styles.overlay} onPress={onHide}>
        <Pressable style={[styles.modalContainer, style]} onPress={() => {}}>
          <OverlayStatusBar />

          <KeyboardAvoidingView>
            <Row style={styles.header}>
              <View style={styles.placeholderIcon} />

              <Text style={[styles.titleText, titleStyle]}>{title}</Text>

              <Pressable onPress={onHide}>
                <Icon
                  source="close"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.black}
                />
              </Pressable>
            </Row>

            <Column style={styles.body}>{children}</Column>

          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

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
    paddingBottom: 24,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 2,
    borderBottomColor: colors.fbBg,
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    backgroundColor: colors.transparent,
  },
  body: {
    paddingVertical: 16
  },
});
