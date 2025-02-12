import {Tab, TabView} from '@rneui/themed';
import {Bucket} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import {Column, NormalHeader, Row} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {BronzeRank, DiamonRank, GoldRank, NewRank, SilverRank} from './ranks';

const width = Dimensions.get('window').width;

const MembershipScreen = props => {
  const {navigation} = props;
  const progress = 0.5;
  const progressBarWidth = width - 4 * GLOBAL_KEYS.PADDING_DEFAULT;
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.container}>
      <NormalHeader
        title="Hạng thành viên"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Card container */}
      <Column style={styles.cardContainer}>
        <CardHeader rank="MỚi" bean="0" />
        <ProgressSection
          progress={progress}
          progressBarWidth={progressBarWidth}
        />
        <InfoContainer
          messages={[
            'Còn 100 BEAN nữa bạn sẽ thăng hạng.',
            'Đổi quà không ảnh hưởng tới việc thăng hạng của bạn.',
            'Chưa tích điểm.',
          ]}
        />
      </Column>

      {/* TabView container */}
      <Tab
        value={index}
        onChange={e => setIndex(e)}
        indicatorStyle={styles.indicatorStyle}
        containerStyle={[styles.tabContainer, {width: width}]}
        variant="primary"
        scrollable={true}>
        <Tab.Item
          title="Mới"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 0 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
        <Tab.Item
          title="Đồng"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 1 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
        <Tab.Item
          title="Bạc"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 2 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
        <Tab.Item
          title="Vàng"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 3 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
        <Tab.Item
          title="Kim cương"
          titleStyle={{
            fontSize: 12,
            fontWeight: '500',
            color: index === 4 ? colors.primary : colors.gray700,
          }}
          containerStyle={styles.tabItemContainer}
        />
      </Tab>

      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        containerStyle={styles.tabViewContainer}>
        <TabView.Item style={styles.tabViewItem}>
          <NewRank />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <BronzeRank />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <SilverRank />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <GoldRank />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <DiamonRank />
        </TabView.Item>
      </TabView>
    </View>
  );
};

// Component con cho Header của Card
const CardHeader = ({rank, bean}) => (
  <Row style={styles.headerContainer}>
    <Text style={styles.rankText}>{rank}</Text>
    <Text style={styles.beanText}>{bean} Bean</Text>
  </Row>
);

// Component con cho ProgressBar và thông tin
const ProgressSection = ({progress, progressBarWidth}) => (
  <Column>
    <Row style={styles.rank}>
      <Text style={styles.progressText}>MỚi</Text>
      <Text style={styles.progressText}>Đồng</Text>
    </Row>

    <Column style={styles.progressBarContainer}>
      <ProgressBar
        progress={progress}
        width={progressBarWidth}
        height={10}
        color={colors.green500}
        unfilledColor={colors.white}
        borderWidth={0}
        style={styles.progressBar}
      />
      <Column
        style={[
          styles.iconContainer,
          {left: progress * (progressBarWidth - 16)},
        ]}>
        <Bucket size="24" color={colors.yellow500} variant="Bold" />
      </Column>
    </Column>
  </Column>
);

// Component con cho các thông tin phía dưới
const InfoContainer = ({messages}) => (
  <View style={styles.infoContainer}>
    {messages.map((msg, index) => (
      <Text key={index} style={styles.infoText}>
        {msg}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  cardContainer: {
    backgroundColor: colors.primary,
    borderTopEndRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    borderTopStartRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  rankText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 24,
  },
  beanText: {
    color: colors.white,
  },
  progressBarContainer: {
    position: 'relative',
    height: 10,
    justifyContent: 'center',
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
  },
  iconContainer: {
    position: 'absolute',
  },
  rank: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  progressText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  progressBar: {
    flex: 1,
  },
  infoContainer: {
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
  },
  infoText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
  },
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 3,
  },
  tabContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  tabItemContainer: {
    backgroundColor: colors.white,
  },
  tabViewContainer: {
    backgroundColor: colors.gray200,
  },
  tabViewItem: {
    backgroundColor: colors.gray200,
  },
});

export default MembershipScreen;
