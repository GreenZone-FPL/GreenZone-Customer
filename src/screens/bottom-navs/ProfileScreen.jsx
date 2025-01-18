import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { HeaderWithBadge, LightStatusBar } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppGraph, AuthGraph, OrderGraph, UserGraph } from '../../layouts/graphs';

const ProfileScreen = props => {
  const navigation = props.navigation;

  return (
    <SafeAreaView style={styles.container}>

      <LightStatusBar />
      <HeaderWithBadge title="Cá nhân" />

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        <View>
          <View style={styles.accountContainer}>
            <CardAccount
              icon="account"
              color={colors.primary}
              title="Thông tin cá nhân"
              onPress={() => {
                navigation.navigate(UserGraph.UpdateProfileScreen);
              }}
            />
            <CardAccount
              icon="google-maps"
              color={colors.pink500}
              title="Địa chỉ"
              onPress={() => navigation.navigate(UserGraph.AddressScreen)}
            />
          </View>
          <View style={styles.accountContainer}>
            <CardAccount
              icon="file-document-edit"
              color={colors.orange700}
              title="Lịch sử đơn hàng"
              onPress={() => { navigation.navigate(OrderGraph.OrderHistoryScreen) }}
            />
          </View>

        </View>

        <Text style={styles.sectionTitle}>Tiện ích</Text>
        <View style={styles.utilities}>
          <CardUtiliti
            icon="cog"
            title="Cài đặt"
            onPress={() => { }}
          />
          <View style={styles.separator} />
          <CardUtiliti
            icon="chat"
            title="Liên hệ góp ý"
            onPress={() => { navigation.navigate(UserGraph.ContactScreen) }}
          />
          <View style={styles.separator} />
          <CardUtiliti
            icon="star"
            title="Đánh giá đơn hàng"
            onPress={() => {navigation.navigate(OrderGraph.RatingOrderScreen) }}
          />
          <View style={styles.separator} />
          <CardUtiliti
            icon="logout"
            title="Đăng xuất"
            onPress={() => navigation.navigate(AuthGraph.LoginScreen)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const CardAccount = ({ icon, color, title, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Icon source={icon} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={color} />
    <Text style={styles.cardText}>{title}</Text>
  </Pressable>
);

const CardUtiliti = ({ icon, title, onPress }) => (
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
    backgroundColor: colors.white,
    flexDirection: 'column',
  },
  body: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
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