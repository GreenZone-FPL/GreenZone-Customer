import React from 'react';
import { FlatList, StyleSheet, View, Text, Button } from 'react-native';
import {
  EmptyView,
  NormalLoading
} from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { OrderItem } from './OrderItem';
import { OrderHistorySkeleton } from '../../../skeletons';


export const OrderListView = ({
  orders,
  loading,
  onItemPress,
  onPay,
  onCancel,
  setSelectedOrder,
  currentPage,
  totalPages = 3,
  onPageChange
}) => (
  <View style={styles.scene}>
    {/* {!loading ? (
      <OrderHistorySkeleton />
    ) : orders.length > 0 ? (
      <> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <OrderItem order={item} onPress={onItemPress} onPay={onPay} onCancel={onCancel} setSelectedOrder={setSelectedOrder} />
          )}
          contentContainerStyle={{ gap: 5 }}
        />
        {
          totalPages > 1 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
              <Button title="Trước" onPress={() => onPageChange(Math.max(1, currentPage - 1))} />
              <Text>{`${currentPage} / ${totalPages}`}</Text>
              <Button title="Sau" onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
            </View>
          )
        }
      {/* </>

    ) : (
      <EmptyView message='Danh sách này trống' />
    )} */}
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
