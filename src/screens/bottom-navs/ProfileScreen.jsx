import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'react-native-paper';
import {getProfile} from '../../axios';
import {
  Column,
  HeaderWithBadge,
  LightStatusBar,
  NormalLoading,
  Row,
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {MainGraph, OrderGraph, UserGraph} from '../../layouts/graphs';
import {AuthActionTypes, cartInitialState} from '../../reducers';
import {AppAsyncStorage} from '../../utils';
import {CartManager} from '../../utils';

const ProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {authState, authDispatch, cartDispatch} = useAppContext();

  console.log('authState', authState);
  const handleProfile = async () => {
    setLoading(true);
    try {
      const reponse = await getProfile();
      console.log('profile', reponse);
      navigation.navigate(UserGraph.UpdateProfileScreen, {profile: reponse});
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <HeaderWithBadge title="Cá nhân" />
      <ScrollView>
        <Column style={styles.body}>
          <TitleText text="Tài khoản" />
          <NormalLoading visible={loading} />
          <Column>
            <Row style={styles.accountContainer}>
              <CardAccount
                icon="account"
                color={colors.primary}
                title="Thông tin cá nhân"
                onPress={handleProfile}
              />
              <CardAccount
                icon="google-maps"
                color={colors.pink500}
                title="Địa chỉ"
                onPress={() => navigation.navigate(UserGraph.AddressScreen)}
              />
            </Row>

            <Row style={styles.accountContainer}>
              <CardAccount
                icon="file-document-edit"
                color={colors.orange700}
                title="Lịch sử đơn hàng"
                onPress={() => {
                  navigation.navigate(OrderGraph.OrderHistoryScreen);
                }}
              />
            </Row>
          </Column>

          <TitleText text="Tiện ích" />

          <View style={styles.utilities}>
            <CardUtiliti
              icon="cog"
              title="Cài đặt"
              onPress={() => {
                navigation.navigate(UserGraph.SettingScreen);
              }}
            />
            <View style={styles.separator} />
            <CardUtiliti
              icon="chat"
              title="Liên hệ góp ý"
              onPress={() => {
                navigation.navigate(UserGraph.ContactScreen);
              }}
            />
            <View style={styles.separator} />
            <CardUtiliti
              icon="star"
              title="Đánh giá đơn hàng"
              onPress={() => {
                navigation.navigate(OrderGraph.RatingOrderScreen);
              }}
            />

            <View style={styles.separator} />
            {authState.isLoggedIn && (
              <CardUtiliti
                icon="logout"
                title="Đăng xuất"
                onPress={async () => {
                  // Xóa token khỏi AsyncStorage
                  await AppAsyncStorage.clearAll();
                  await CartManager.updateOrderInfo(
                    cartDispatch,
                    cartInitialState,
                  );
                  authDispatch({
                    type: AuthActionTypes.LOGOUT,
                    payload: {isLoggedIn: false},
                  });
                  // navigation.reset({
                  //   index: 0,
                  //   routes: [{name: MainGraph.graphName}],
                  // });
                }}
              />
            )}
          </View>
        </Column>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const CardAccount = ({icon, color, title, onPress}) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Icon source={icon} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={color} />
    <Text style={styles.cardText}>{title}</Text>
  </Pressable>
);

const CardUtiliti = ({icon, title, onPress}) => (
  <Pressable style={styles.item} onPress={onPress}>
    <View style={styles.leftSection}>
      <Icon
        source={icon}
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        color={colors.gray700}
      />
      <Text style={styles.itemText}>{title}</Text>
    </View>
  </Pressable>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fbBg,
    flexDirection: 'column',
  },
  body: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  sectionTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
  },
  accountContainer: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    marginBottom: GLOBAL_KEYS.GAP_DEFAULT,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    elevation: 3,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  cardText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  utilities: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  itemText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
});
