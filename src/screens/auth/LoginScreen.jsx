import LottieView from 'lottie-react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  Animated

} from 'react-native';
import { Icon } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { sendOTPAPI } from '../../axios';
import { Column, FlatInput, LightStatusBar, NormalText, OverlayStatusBar, Row, TitleText, Ani_ModalLoading } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AuthGraph } from '../../layouts/graphs';
import { refreshTokenAPI } from '../../axios';
import { Toaster } from '../../utils';



const LoginScreen = ({ route, navigation }) => {

  const [phoneNumber, setPhoneNumber] = useState('0868441273');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(route.params?.message || '');


  const fadeAnim = useRef(new Animated.Value(1)).current; // Giá trị opacity ban đầu là 1

  useEffect(() => {
    if (message) {
      // Sau 2 giây, làm mờ rồi ẩn message
      Animated.timing(fadeAnim, {
        toValue: 0, // Mờ dần về 0
        duration: 500, // Trong 500ms
        delay: 2000, // Chờ 2 giây trước khi bắt đầu
        useNativeDriver: true,
      }).start(() => setMessage('')); // Sau khi hoàn tất, xóa message
    }
  }, [message]);

  const handleSendOTP = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      return;
    }

    setLoading(true);
    try {
      const response = await sendOTPAPI({ phoneNumber });
      if (response) {
        console.log('otp = ', response.code);
        navigation.navigate(AuthGraph.VerifyOTPScreen, { phoneNumber });
      } else {
        Alert.alert('Lỗi', 'Không thể gửi OTP, vui lòng thử lại sau.');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (


    <Column style={styles.container}>
      {message ? (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
          <Icon source="information" size={20} color={colors.primary} />
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      ) : null}


      <LightStatusBar />
      <Image
        source={require('../../assets/images/register_bg.png')}
        style={{ width: '100%', height: 200 }}
      />
      <TitleText text="Chào mừng đến với" style={{ textAlign: 'center' }} />
      <TitleText text="GREEN ZONE" style={styles.title} />

      <FlatInput
        value={phoneNumber}
        label="Số điện thoại"
        placeholder="Nhập số điện thoại của bạn..."
        style={styles.input}
        setValue={(text) => {
          setPhoneNumberError(false);
          setPhoneNumberMessage('');
          setPhoneNumber(text);
        }}
        error={phoneNumberError}
        invalidMessage={phoneNumberMessage}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <View style={{ width: 30, height: 30 }}></View>
        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        <Icon source="arrow-right-circle" color={colors.white} size={30} />
      </TouchableOpacity>



      {/* <Row style={styles.separatorContainer}>
        <View style={styles.separator} />
        <NormalText text="Hoặc" />
        <View style={styles.separator} />
      </Row>

      <Pressable style={styles.socialButton}>
        <AntDesign name="facebook-square" color={colors.white} size={24} />
        <Text style={styles.socialText}>Tiếp tục bằng Facebook</Text>
      </Pressable>

      <Pressable style={[styles.socialButton, styles.googleButton]}>
        <AntDesign name="google" color={colors.primary} size={24} />
        <Text style={[styles.socialText, styles.googleText]}>Tiếp tục bằng Google</Text>
      </Pressable> */}


      <Ani_ModalLoading loading={loading} />

    </Column>



  );
};

// const Ani_ModalLoading = ({loading}) => {
//   return (
//     <Modal transparent={true} visible={loading} animationType="fade">
//       <OverlayStatusBar />
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <LottieView
//             source={require('../../assets/animations/ani_loading.json')}
//             autoPlay
//             loop
//             style={{ width: 100, height: 100 }}
//           />
//           <Text style={styles.loadingText}>Đang xử lý...</Text>
//         </View>
//       </View>
//     </Modal>
//   )
// }

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    gap: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  toast: {
    position: 'absolute',
    top: 40,
    left: 20,
    // right: 20,
    backgroundColor: colors.black,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    elevation: 4, // Đổ bóng trên Android
    shadowColor: '#000', // Đổ bóng trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 8,
  },
  toastText: {
    color: colors.white,
    fontSize: 14,
    flexShrink: 1, // Giúp text không bị tràn ra ngoài
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,

  },
  input: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
  },

  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: colors.blue600,
    paddingVertical: 16,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'

  },
  socialText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    marginLeft: 10,
  },
  googleButton: {
    backgroundColor: colors.white,
    borderColor: colors.gray200,
    borderWidth: 1,
  },
  googleText: {
    color: colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.gray200,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
  },
});
