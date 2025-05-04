import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'react-native-paper';
import {getProfile} from '../../axios';
import {
  AuthContainer,
  Column,
  HeaderWithBadge,
  LightStatusBar,
  NormalLoading,
  NormalText,
  Row,
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAuthActions} from '../../containers';
import {useAuthContext} from '../../context';
import {AppGraph, OrderGraph, UserGraph} from '../../layouts/graphs';
import {Toaster} from '../../utils';

const ProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {authState} = useAuthContext();
  const {onLogout, onNavigateLogin} = useAuthActions();

  const handleProfile = async () => {
    setLoading(true);
    try {
      if (authState.lastName) {
        const reponse = await getProfile();
        navigation.navigate(UserGraph.UpdateProfileScreen, {profile: reponse});
      } else {
        onNavigateLogin();
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await onLogout();
    } catch (error) {
      Toaster.show(error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateIfLoggedIn = screen => {
    authState.lastName ? navigation.navigate(screen) : onNavigateLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalLoading visible={loading} />
      <HeaderWithBadge title="Cá nhân" enableBadge={!!authState.lastName} />

      <ScrollView>
        {!authState.lastName && <AuthContainer onPress={onNavigateLogin} />}
        <Column style={styles.body}>
          <TitleText text="Tài khoản" />

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
                onPress={() => navigateIfLoggedIn(UserGraph.AddressScreen)}
              />
            </Row>

            <Row style={styles.accountContainer}>
              <CardAccount
                icon="file-document-edit"
                color={colors.orange700}
                title="Lịch sử đơn hàng"
                onPress={() =>
                  navigateIfLoggedIn(OrderGraph.OrderHistoryScreen)
                }
              />
            </Row>
          </Column>

          <TitleText text="Tiện ích" />

          <View style={styles.utilities}>
            <CardUtiliti
              icon="cog-outline"
              title="Cài đặt"
              onPress={() => navigateIfLoggedIn(UserGraph.SettingScreen)}
            />

            <CardUtiliti
              icon="chat-outline"
              title="Liên hệ góp ý"
              onPress={() => navigateIfLoggedIn(UserGraph.ContactScreen)}
            />

            <CardUtiliti
              icon="star-outline"
              title="Đánh giá đơn hàng"
              onPress={() => navigateIfLoggedIn(OrderGraph.RatingOrderScreen)}
            />
          

            {authState.lastName && (
              <CardUtiliti
                icon="logout"
                title="Đăng xuất"
                onPress={handleLogout}
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
    <Icon source={icon} size={30} color={color} />
    <TitleText text={title} />
  </Pressable>
);

const CardUtiliti = ({icon, title, onPress}) => (
  <Pressable style={styles.item} onPress={onPress}>
    <View style={styles.leftSection}>
      <Icon source={icon} size={26} color={colors.gray700} />
      <NormalText text={title} style={{fontSize: 14}} />
    </View>
  </Pressable>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    paddingVertical: 12,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: 10,
  },
  cardText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.black,
    fontWeight: '400',
  },
  utilities: {
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
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
