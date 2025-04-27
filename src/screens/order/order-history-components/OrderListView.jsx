import React from 'react';
import { FlatList, StyleSheet, View, Text, Button } from 'react-native';
import {
  Column,
  EmptyView,
  NormalLoading,
  NormalText,
  Row
} from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { OrderItem } from './OrderItem';
import { OrderHistorySkeleton } from '../../../skeletons';
import { Pressable } from 'react-native';
import { Icon } from 'react-native-paper';


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
    {loading ? (
      <OrderHistorySkeleton />
    ) : orders.length > 0 ? (
      <Column style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <OrderItem order={item} onPress={onItemPress} onPay={onPay} onCancel={onCancel} setSelectedOrder={setSelectedOrder} />
          )}
          contentContainerStyle={{ gap: 0 }}
        />
        {
          totalPages > 1 && (
            <Row style={styles.navigator}>
              <Pressable
                onPress={() => onPageChange(Math.max(1, currentPage - 1))}
              >

                <Icon source='chevron-left' size={24} color={colors.gray700} />
              </Pressable>

              <NormalText
                style={styles.pageNumber}
                text={`${currentPage} / ${totalPages}`}
              />

              <Pressable
                onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              >

                <Icon source='chevron-right' size={24} color={colors.gray700} />
              </Pressable>


            </Row>
          )
        }
      </Column>

    ) : (
      <EmptyView message='Danh sách này trống' />
    )
    }
  </View>
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    paddingTop: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.fbBg,


  },
  container: {
    gap: 0,
    marginHorizontal: 8,
    borderRadius: 16,
    paddingTop: 8,
    backgroundColor: colors.white
  },
  navigator: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,

  },
  pageNumber: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '400'
  }
})
