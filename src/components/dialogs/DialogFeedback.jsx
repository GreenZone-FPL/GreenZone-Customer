import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';
import { NormalText } from '../texts/NormalText';


const { height, width } = Dimensions.get('window');

const DialogFeedbackPropTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};


export const DialogFeedback = ({ isVisible, onHide }) => {
  const [value, setValue] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImagePickerVisible, setImagePickerVisible] = useState(false); // Modal state

  const openCamera = () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.didCancel || response.errorCode) return;

      setSelectedImages(prev => {
        const newImages = response?.assets[0]?.uri;
        if (prev.length < 3) {
          return [...prev, newImages];
        }
        return prev;
      });
    });
    setImagePickerVisible(false); // Hide modal
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 3 - selectedImages.length,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel || response.errorCode) return;

      setSelectedImages(prev => {
        const newImages = response.assets.map(asset => asset.uri);
        return [...prev, ...newImages].slice(0, 3);
      });
    });
    setImagePickerVisible(false); // Hide modal
  };

  const removeImage = index => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const isButtonDisabled = value.trim() === '';

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
                <Text style={styles.titleText}>Gửi góp ý về ứng dụng</Text>
                <TouchableOpacity onPress={onHide}>
                  <Icon
                    source="close"
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.feedbackContainer}>
                <Text style={styles.textTitle}>
                  Đối với GreenZone, mọi góp ý của bạn đều quý giá
                </Text>
                <View style={styles.viewInputFeedback}>
                  <TextInput
                    placeholder="Chia sẻ cảm nghĩ của bạn về ứng dụng cho GreenZone tại đây"
                    placeholderTextColor={colors.gray400}
                    multiline
                    style={styles.inputFeedback}
                    value={value}
                    onChangeText={setValue}
                  />
                </View>
                <View style={styles.imageContainer}>
                  {selectedImages.map((imageUri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image
                        style={styles.imagePreview}
                        source={{ uri: imageUri }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeImage(index)}>
                        <Icon
                          source="close"
                          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                          color={colors.green750}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {selectedImages.length < 3 && (
                  <Pressable
                    style={styles.btnUploadImage}
                    onPress={() => setImagePickerVisible(true)}>
                    <Icon
                      source="camera"
                      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                      color={colors.primary}
                    />

                    <NormalText text='Tải lên hình ảnh' />

                  </Pressable>
                )}
                <PrimaryButton
                  title="Gửi phản hồi"
                  onPress={() => {
                    if (!isButtonDisabled) {
                      console.log('Phản hồi:', value);
                      console.log('Hình ảnh đã chọn:', selectedImages);
                    }
                  }}
                  style={{
                    backgroundColor: isButtonDisabled
                      ? colors.gray400
                      : colors.primary,
                  }}
                  disabled={isButtonDisabled}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>

      <Modal
        visible={isImagePickerVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.imagePickerOverlay}>
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.option} onPress={openCamera}>
              <NormalText text="Chụp ảnh mới" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={openImageLibrary}>
              <NormalText text="Chọn ảnh từ thư viện" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => setImagePickerVisible(false)}>
              <NormalText text="Hủy bỏ" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

DialogFeedback.propTypes = DialogFeedbackPropTypes;

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
  feedbackContainer: {
    flexDirection: 'column',
    margin: 14,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  textTitle: {
    fontWeight: '600',
    color: colors.pink500,
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER
  },
  viewInputFeedback: {
    borderWidth: 1,
    borderColor: colors.gray200,
    height: height / 3,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
  },
  inputFeedback: {
    flex: 1,
    color: colors.black,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    textAlignVertical: 'top',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GLOBAL_KEYS.GAP_SMALL,
    marginVertical: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: width / 4,
    height: height / 8,
  },
  imagePreview: {
    width: width / 4,
    height: height / 8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
    width: 24,
    height: 24,
  },
  btnUploadImage: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
  },
  imagePickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  imagePickerContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  option: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
});