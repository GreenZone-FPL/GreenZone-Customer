import React from 'react';
import {ScrollView} from 'react-native';
import {CardRank} from './CardRank';

export const DiamonRank = () => {
  return (
    <ScrollView style={{flex: 1}}>
      <CardRank icon={'TextBold'} title={'Được nhận 1.5 BEAN tích lũy'} />
      <CardRank icon={'Cake'} title={'Tặng 01 phần bánh sinh nhật'} />
      <CardRank icon={'Coffee'} title={'Miễn phí 01 phần nước bất kỳ'} />
      <CardRank
        icon={'TicketStar'}
        title={'Nhận ưu đãi riêng từ GreenZone và đối tác khác'}
      />
      <CardRank
        icon={'MagicStar'}
        title={
          'Cơ hội trãi nghiệm & hưởng đặc quyền tại các sự kiện của GreenZone'
        }
      />
      <CardRank
        icon={'TextBold'}
        title={'Đặt quyền đổi ưu đãi bằng điểm BEAN tích lũy'}
      />
    </ScrollView>
  );
};


