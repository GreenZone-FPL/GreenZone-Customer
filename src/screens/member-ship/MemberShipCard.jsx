import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import {colors} from '../../constants';
import {Bucket} from 'iconsax-react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {NormalHeader} from '../../components';

// Component con cho Header của Card
const CardHeader = ({rank, bean}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.rankText}>{rank}</Text>
    <Text style={styles.beanText}>{bean} bean</Text>
  </View>
);

// Component con cho ProgressBar và thông tin
const ProgressSection = ({progress, progressBarWidth}) => (
  <View>
    <View style={styles.rank}>
      <Text style={styles.progressText}>MỚi</Text>
      <Text style={styles.progressText}>Đồng</Text>
    </View>

    <View style={styles.progressBarContainer}>
      <ProgressBar
        progress={progress}
        width={progressBarWidth}
        height={10}
        color={colors.green500}
        unfilledColor={colors.white}
        borderWidth={0}
        style={styles.progressBar}
      />
      <View
        style={[
          styles.iconContainer,
          {left: progress * (progressBarWidth - 16)},
        ]}>
        <Bucket size="24" color={colors.yellow500} variant="Bold" />
      </View>
    </View>
  </View>
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

// Các nội dung cho từng tab
const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: colors.white}]}>
    <Text style={styles.tabText}>Tab 1 Content</Text>
  </View>
);
const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: colors.white}]}>
    <Text style={styles.tabText}>Tab 2 Content</Text>
  </View>
);
const ThirdRoute = () => (
  <View style={[styles.scene, {backgroundColor: colors.white}]}>
    <Text style={styles.tabText}>Tab 3 Content</Text>
  </View>
);
const FourthRoute = () => (
  <View style={[styles.scene, {backgroundColor: colors.white}]}>
    <Text style={styles.tabText}>Tab 4 Content</Text>
  </View>
);
const FifthRoute = () => (
  <View style={[styles.scene, {backgroundColor: colors.white}]}>
    <Text style={styles.tabText}>Tab 5 Content</Text>
  </View>
);

const MembershipCard = () => {
  const progress = 0.5;
  const progressBarWidth = 260; // Width of the progress bar
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Mới'},
    {key: 'second', title: 'Đồng'},
    {key: 'third', title: 'Bạc'},
    {key: 'fourth', title: 'Vàng'},
    {key: 'fifth', title: 'Kim cương'},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute />;
      case 'second':
        return <SecondRoute />;
      case 'third':
        return <ThirdRoute />;
      case 'fourth':
        return <FourthRoute />;
      case 'fifth':
        return <FifthRoute />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <NormalHeader title="Hạng thành viên" />

      {/* Card container */}
      <View style={styles.cardContainer}>
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
      </View>

      {/* TabView container */}
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        style={[styles.tabView, styles.shadowStyle,]}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: colors.primary, height: 2}}
            style={[{backgroundColor: colors.white}]}
            activeColor={colors.primary}
            inactiveColor={colors.gray700}
            tabStyle={{width: 'auto'}}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: colors.primary,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    padding: 20,
    marginHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
  beanText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  progressBarContainer: {
    position: 'relative',
    height: 10,
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    position: 'absolute',
  },
  rank: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  progressBar: {
    flex: 1,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  tabView: {
    flex: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: '#000',
    fontSize: 16,
  },
  shadowStyle: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default MembershipCard;
