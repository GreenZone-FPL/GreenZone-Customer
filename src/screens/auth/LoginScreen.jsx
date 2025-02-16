import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
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
import { Column, FlatInput, LightStatusBar, NormalPrimaryText, NormalText, Row, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AuthGraph } from '../../layouts/graphs';
import { AppAsyncStorage } from '../../utils';


const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('0868441273');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
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
      setPhoneNumberError(true);
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)')
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
    <LinearGradient
      colors={[colors.primary, colors.green200, colors.milk200]}
      locations={[0, 0.5, 1]} // Điều chỉnh cách màu chuyển tiếp
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }} // Kết hợp ngang và dọc
      style={styles.container}
    >


      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <KeyboardAvoidingView>
          <LightStatusBar />
          {/* <Image
            source={require('../../assets/images/banerlogin.png')}
            style={styles.imgBanner}
          /> */}
          <Column style={styles.body}>
            <Column style={styles.content}>
              <TitleText text='Chào mừng bạn đến với' />
              <TitleText text='GREEN ZONE' style={styles.title} />

              <FlatInput
                value={phoneNumber}
                label="Nhập số điện thoại"
                style={{ width: '100%' }}
                placeholder="Nhập số điện thoại của bạn..."
                setValue={(text) => {
                  setPhoneNumberError(false)
                  setPhoneNumberMessage('')
                  setPhoneNumber(text)
                }}
                error={phoneNumberError}
                invalidMessage={phoneNumberMessage}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendOTP}
              >
                <View style={{ width: 35, height: 35 }}></View>
                <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                <Icon source="arrow-right-circle" color={colors.white} size={35} />

              </TouchableOpacity>

              <Row>
                <View style={styles.separator}></View>
                <NormalText text='Hoặc' />
                <View style={styles.separator}></View>
              </Row>


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


            </Column>
          </Column>
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
    </LinearGradient >
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
    alignItems: 'center', // Căn giữa nội dung theo chiều ngang
    backgroundColor: colors.fbBg,

  },

  imgBanner: {
    width: '100%',
    height: 360,
    resizeMode: 'stretch',
  },
  body: {
    // flexGrow: 1,
    flexDirection: 'column',
    marginHorizontal: 20, // Cách đều hai cạnh trái phải 20px
    marginVertical: 20, // Cách đều hai cạnh trên dưới 20px
    padding: 20, // Đảm bảo nội dung bên trong không bị sát mép
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },

  content: {
    // flex: 1,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor: colors.fbBg

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
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.primary
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
