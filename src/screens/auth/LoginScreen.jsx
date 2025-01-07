import { StyleSheet, Image, Alert, View, Text, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import GLOBAL_KEYS from '../../constants/globalKeys';
import colors from '../../constants/color';
import FlatInput from '../../components/inputs/FlatInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AntDesign from 'react-native-vector-icons/AntDesign';


const LoginScreen = (props) => {
<<<<<<< HEAD
  const [value, setValue] = useState()
=======
 
  

>>>>>>> dai/setup-bottom-navigation
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
            <Text style={styles.welcome}>
              Chào mừng bạn đến với
            </Text>
            <Text style={styles.title}>
              GREEN ZONE
            </Text>
            <FlatInput
              label='Nhập số điện thoại'
              style={{ width: '100%' }}
              placeholder='Nhập số điện thoại của bạn...'
              setValue={setValue}
            />
            <PrimaryButton
              title='Đăng nhập'
              onPress={() => console.log('đăng nhập')}
              style={{ width: '100%' }}
            />
            <View style={styles.row}>
              <View style={styles.separator}></View>
              <Text style={styles.other}>Hoặc</Text>
              <View style={styles.separator}></View>
            </View>
            <Pressable style={styles.fbLoginBtn}>
              <AntDesign name="facebook-square" color={colors.white} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} />
              <Text style={styles.textFb}>Tiếp tục bằng Facebook</Text>
            </Pressable>
            <Pressable style={styles.googleLoginBtn}>
              <AntDesign name="google" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} />
              <Text style={styles.textGoogle}>Tiếp tục bằng Google</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  imgBanner: {
    width: '100%',
    height: 360,
    resizeMode: "stretch",
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
    fontWeight: '400'
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
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
    justifyContent: 'center'
  },
  textFb: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
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
    borderWidth: 1
  },
  textGoogle: {
    textAlign: 'center',
    color: colors.black,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  }
});