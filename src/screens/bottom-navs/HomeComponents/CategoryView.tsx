import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Image, Pressable } from 'react-native';
import { Column, TitleText } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import {
  Coin1,
  MessageFavorite,
  Rank,
  TaskSquare,
  TicketDiscount,
  Coffee
} from 'iconsax-react-native';
import {
  AppGraph,
  OrderGraph,
  UserGraph,
  VoucherGraph,
} from '../../../layouts/graphs';
import { colors, GLOBAL_KEYS } from '../../../constants';

type NavigationProps = { navigate: (screen: string) => void };
type ItemProps = {
  IconComponent: React.FC;
  title: string;
  onPress?: () => void;
};

const Item: React.FC<ItemProps> = ({ IconComponent, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <IconComponent />
      <TitleText text={title} />
    </TouchableOpacity>
  );
};

export const CategoryView: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 22 }}>
        <Item
          IconComponent={() => (
            <TicketDiscount size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Voucher"
          onPress={() => navigation.navigate(VoucherGraph.SelectVouchersScreen)}
        />

        <Item
          IconComponent={() => (
            <TaskSquare size="50" color={colors.pink500} variant="Bulk" />
          )}
          title="Đơn Hàng"
          onPress={() => navigation.navigate(OrderGraph.OrderHistoryScreen)}
        />
        <Pressable
          onPress={() => { navigation.navigate(VoucherGraph.SeedScreen) }}
          style={styles.seedContainer}>
          <Image
            style={styles.iconSeed}
            source={require('../../../assets/seed/icon_seed.png')}
          />
          <TitleText text='Đổi Seed' />
        </Pressable>

        <Item
          IconComponent={() => (
            <MessageFavorite size="50" color={colors.orange700} variant="Bulk" />
          )}
          title="Góp ý"
          onPress={() => navigation.navigate(UserGraph.ContactScreen)}
        />
        <Item
          IconComponent={() => (
            <Rank size="50" color={colors.green500} variant="Bulk" />
          )}
          title="Hạng thành viên"
          onPress={() => navigation.navigate(AppGraph.MembershipScreen)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    borderWidth: 1,
    borderColor: colors.gray200,
    margin: 16,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  seedContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 6

  },
  iconSeed: {
    width: 44,
    height: 44,
    borderRadius: 48
  },
});
