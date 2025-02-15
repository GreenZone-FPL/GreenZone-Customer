import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { sendOTPAPI } from '../../axios';
import { FlatInput, LightStatusBar, Row } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AuthGraph } from '../../layouts/graphs';
import { AppAsyncStorage } from '../../utils';


const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('0868441273');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken);
      console.log('accessToken', accessToken);
    };
    fetchToken();
  }, []);

  const handleSendOTP = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
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
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView>
        <LightStatusBar />
        <Image
          source={require('../../assets/images/banerlogin.png')}
          style={styles.imgBanner}
        />
        <View style={styles.body}>
          <View style={styles.content}>
            <Text style={styles.welcome}>Chào mừng bạn đến với</Text>
            <Text style={styles.title}>GREEN ZONE</Text>
            <FlatInput
              value={phoneNumber}
              label="Nhập số điện thoại"
              style={{ width: '100%' }}
              placeholder="Nhập số điện thoại của bạn..."
              setValue={setPhoneNumber}
              // autoFocus
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSendOTP}
            >
              <Row style={{ width: '100%', justifyContent: 'space-between' }}>
                <View style={{ width: 35, height: 35 }}></View>
                <Text style={styles.buttonText}>Đăng nhập</Text>
                <Icon source="arrow-right-circle" color={colors.white} size={35} />
              </Row>
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={styles.separator}></View>
              <Text style={styles.other}>Hoặc</Text>
              <View style={styles.separator}></View>
            </View>
            <Pressable style={styles.fbLoginBtn}>
              <AntDesign
                name="facebook-square"
                color={colors.white}
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              />
              <Text style={styles.textFb}>Tiếp tục bằng Facebook</Text>
            </Pressable>
            <Pressable style={styles.googleLoginBtn}>
              <AntDesign
                name="google"
                color={colors.primary}
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              />
              <Text style={styles.textGoogle}>Tiếp tục bằng Google</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal hiển thị overlay khi đang loading */}
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require('../../assets/animations/ani_loading.json')} // Đường dẫn tới file JSON của bạn
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.fbBg,
  },
  imgBanner: {
    width: '100%',
    height: 360,
    resizeMode: 'stretch',
  },
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  welcome: {
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '400',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary,
  },
  other: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    fontWeight: '500',
  },
  fbLoginBtn: {
    backgroundColor: colors.blue600,
    flexDirection: 'row',
    width: '100%',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'center',
  },
  textFb: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  googleLoginBtn: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    width: '100%',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 1,
  },
  textGoogle: {
    textAlign: 'center',
    color: colors.black,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },

  button: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
});
