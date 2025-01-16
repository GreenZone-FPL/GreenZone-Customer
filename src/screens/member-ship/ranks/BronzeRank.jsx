import React from 'react';
import {StyleSheet, View} from 'react-native';
import { CardRank } from './CardRank';


export const BronzeRank = () => {
  return (
    <View>
      <CardRank icon="Cake" title={'Tặng 01 phần bánh sinh nhật'} />
      <CardRank
        icon={'Coffee'}
        title={'Miễn phí 01 phần bánh cho đơn hàng trên 100,000đ'}
      />
      <CardRank
        icon={'TextBold'}
        title={'Đặt quyền đổi ưu đãi bằng điểm BEAN tích lũy'}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
