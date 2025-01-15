import React from 'react';
import {View} from 'react-native';
import {CardRank} from './CardRank';

export const SilverRank = () => {
  return (
    <View>
      <CardRank icon={'Cake'} title={'Tặng 01 phần bánh sinh nhật'} />
      <CardRank icon={'Ticket2'} title={'Ưu đãi mua 2 tặng 1'} />
      <CardRank
        icon={'TextBold'}
        title={'Đặt quyền đổi ưu đãi bằng điểm BEAN tích lũy'}
      />
    </View>
  );
};


