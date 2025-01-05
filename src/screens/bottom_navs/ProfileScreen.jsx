import { StyleSheet, Image, SafeAreaView, Text, View, ScrollView , TouchableOpacity, StatusBar} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status_bars/LightStatusBar';
import HeaderWithBadge from '../../components/headers/HeaderWithBadge';


  const ProfileScreen = (props) => {
    const {navigation} = props

    return (
      <SafeAreaView style={styles.container}>
        <LightStatusBar/>
        <HeaderWithBadge   title="Cá nhân"   />
        <ScrollView style={styles.body}>
          <Text style={styles.tittle}>
            Tài khoản
          </Text>
          <View style={styles.extention}>
            <TouchableOpacity style={styles.card}>
              <Feather name="user" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary}  />
              <Text style={styles.cardText}>Thông tin cá nhân</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Feather name="map-pin" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.pink500}  />
              <Text style={styles.cardText}>Địa chỉ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
              <TouchableOpacity style={styles.card}>
                <Feather name="file-text" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.orange700} />
                <Text style={styles.cardText}>Lịch sử đơn hàng</Text>
              </TouchableOpacity>
          </View>
          <Text style={styles.tittle}>
            Tiện ích
          </Text>
          <View style={styles.support}>
              <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <AntDesign name="setting" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.gray700} />
                <Text style={styles.title}>Thông tin cá nhân</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />
            <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <Feather name="message-circle" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.gray700} />
                <Text style={styles.title}>Liên hệ góp ý</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />
            <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <Feather name="star" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.gray700} />
                <Text style={styles.title}>Cài đặt</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />
            <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <AntDesign name="login" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.gray700} />
                <Text style={styles.title}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    );
  };

  export default ProfileScreen;

  const styles = StyleSheet.create({
    separator: {
      height: 1,
      backgroundColor: colors.gray300,
      marginVertical: 5,
      width: "100%",
      
    },
    support:{
      backgroundColor: colors.white,
      paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
      paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0,
      shadowRadius: 2,
      elevation: 2,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
      
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      marginLeft: 10,
      fontSize: 16,
      color: colors.black,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    card: {
      flex: 1,
      height: 80,
      backgroundColor: colors.white,
      marginHorizontal: 5,
      borderRadius: 10,
      padding: GLOBAL_KEYS.PADDING_SMALL,
      justifyContent: 'space-around',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 1,
      elevation: 1,
    },
    cardText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.black,
    },
    extention:{
      flexDirection: 'row'
    },
    tittle:{
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
    },
    body:{
      flexDirection: 'column',
      paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
  });