import moment from 'moment';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../../constants';
import {Row} from '../../../components/containers/'

export const TimelineStatus = ({detail}) => {
  const {
    status,
    createdAt,
    readyForPickupAt,
    shippingOrderAt,
    completedAt,
    cancelledAt,
  } = detail;

  const formatTime = time => {
    return time ? moment(time).format('HH:mm DD/MM') : null;
  };

  // Tạo danh sách các mốc timeline theo thứ tự logic
  const timelineData = [
    createdAt && {
      time: formatTime(createdAt),
      title: 'Đơn hàng của bạn vừa được tạo',
      status: OrderStatus.PENDING_CONFIRMATION.value
    },
    readyForPickupAt && {
      time: formatTime(readyForPickupAt),
      title: 'GreenZone vừa xác nhận đơn hàng của bạn',
      status: OrderStatus.READY_FOR_PICKUP.value

    },
    shippingOrderAt && {
      time: formatTime(shippingOrderAt),
      title: 'Nhân viên GreenZone đang giao hàng, chờ nhận đơn',
      status: OrderStatus.SHIPPING_ORDER.value

    },
    completedAt && {
      time: formatTime(completedAt),
      title: 'Giao hàng hoàn tất',
      status: OrderStatus.COMPLETED.value

    },
    cancelledAt && {
      time: formatTime(cancelledAt),
      title: 'Đơn hàng đã hủy',
      status: OrderStatus.CANCELLED.value
    },
  ].filter(Boolean);
  // Detail.status === item.status
  const TimelineItem = ({item, isLast,}) => {

    const color = item.status == status ? colors.orange700 : colors.black;
    
    return(
    <View style={styles.itemContainer}>
      {/* Cột trái: vòng tròn và line */}
      <View style={styles.leftColumn}>
        <View style={styles.circle} />
        {!isLast && <View style={styles.verticalLine} />}
      </View>
      {/* Cột phải: nội dung */}
      <View style={styles.rightContent}>
        <View style={styles.bubble}>
          <Text style={styles.timeText}>{item.time}</Text>
          <Text style={[styles.titleText, {color}]}>{item.title}</Text>
        </View>
      </View>
    </View>
  );
};
  return (
    <View
      style={[
        styles.areaContainer,
        {paddingHorizontal: 16, paddingVertical: 8, gap: 8},
      ]}>
      <FlatList
        data={timelineData}
        keyExtractor={(index) => index.toString()}
        renderItem={({item, index}) => (
          <TimelineItem
            item={item}
            isLast={index === timelineData.length - 1}
          />
        )}
        contentContainerStyle={{paddingVertical: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  areaContainer: {
    backgroundColor: colors.white,
    marginBottom: 8
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    width: 30,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 24,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: colors.primary,
    zIndex: 1,
  },
  verticalLine: {
    position: 'absolute',
    top: 24,
    width: 2,
    height: '200%',
    backgroundColor: 'green',
    zIndex: 0,
  },
  rightContent: {
    flex: 1,
    paddingLeft: 5,
  },
  bubble: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: 10,
  },
  timeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    marginBottom: 4,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.black,
  },
});
