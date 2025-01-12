import React from 'react';
import {View} from 'react-native';
import {CardRank} from './CardRank';

export const GoldRank = () => {
  return (
    <View>
      <CardRank icon={'Cake'} title={'Tặng 01 phần bánh sinh nhật'} />
      <CardRank icon={'Coffee'} title={'Miễn phí 1 phần Cà phê / trà'} />
      <CardRank
        icon={'TextBold'}
        title={'Đặt quyền đổi ưu đãi bằng điểm BEAN tích lũy'}
      />
    </View>
  );
};

