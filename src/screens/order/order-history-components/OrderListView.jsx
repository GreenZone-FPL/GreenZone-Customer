import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  EmptyView,
  NormalLoading
} from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { OrderItem } from './OrderItem';
import { OrderHistorySkeleton } from '../../../skeletons';


export const OrderListView = ({ orders, loading, onItemPress, onPay, onCancel, setSelectedOrder }) => (
  <View style={styles.scene}>
    {loading ? (
      <OrderHistorySkeleton/>
      // <NormalLoading visible={loading} />
    ) : orders.length > 0 ? (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <OrderItem order={item} onPress={onItemPress} onPay={onPay} onCancel={onCancel} setSelectedOrder={setSelectedOrder} />
        )}
        contentContainerStyle={{ gap: 5 }}
      />
    ) : (
      <EmptyView message='Danh sách này trống' />
    )}
  </View>
);

const styles = StyleSheet.create({
  scene: {
    width: '100%',
    flex: 1,
    paddingTop: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.fbBg
  },
})
