import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {colors, GLOBAL_KEYS} from '../../constants';
import {Icon} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import {PrimaryButton, OverlayStatusBar} from '../../components';
import {Easing} from 'react-native';

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
const {width, height} = Dimensions.get('window');

const ConfirmDeliveryTimeScreen = props => {
  const {navigation} = props;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <OverlayStatusBar />
        <Header currentDay={currentDay} currentTime={currentTime} />
        <Body
          setCurrentDay={setCurrentDay}
          setCurrentTime={setCurrentTime}
          currentTime={currentTime}
        />
        <PrimaryButton
          style={styles.confirmButton}
          title="Xác nhận"
          onPress={() => handleGoBack()}
        />
      </View>
    </View>
  );
};

const Header = ({currentDay, currentTime, handleGoBack}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Thời gian nhận</Text>
      <Text style={styles.headerTime}>
        {currentDay} - {currentTime}
      </Text>
      <TouchableOpacity
        onPress={() => handleGoBack()}
        style={styles.closeButton}>
        <Icon source="close" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} />
      </TouchableOpacity>
    </View>
  );
};

const Body = ({setCurrentDay, setCurrentTime}) => {
  const [indexTime, setIndexTime] = useState(0);
  const [indexDay, setIndexDay] = useState(0);
  const timeNow = Date.now();
  const timeTomorrow = Date.now() + 24 * 60 * 60 * 1000;
  const timeAfterTomorrow = Date.now() + 2 * 24 * 60 * 60 * 1000;

  const time = [
    {name: 'Càng sớm càng tốt', time: 'Càng sớm càng tốt', milisec: 0},
    {name: '08:00', time: '08:00', milisec: 28800000},
    {name: '08:30', time: '08:30', milisec: 30600000},
    {name: '09:00', time: '09:00', milisec: 32400000},
    {name: '09:30', time: '09:30', milisec: 34200000},
    {name: '10:00', time: '10:00', milisec: 36000000},
    {name: '10:30', time: '10:30', milisec: 37800000},
    {name: '11:00', time: '11:00', milisec: 39600000},
    {name: '11:30', time: '11:30', milisec: 41400000},
    {name: '12:00', time: '12:00', milisec: 43200000},
    {name: '12:30', time: '12:30', milisec: 45000000},
    {name: '13:00', time: '13:00', milisec: 46800000},
    {name: '13:30', time: '13:30', milisec: 48600000},
    {name: '14:00', time: '14:00', milisec: 50400000},
    {name: '14:30', time: '14:30', milisec: 52200000},
    {name: '15:00', time: '15:00', milisec: 54000000},
    {name: '15:30', time: '15:30', milisec: 55800000},
    {name: '16:00', time: '16:00', milisec: 57600000},
    {name: '16:30', time: '16:30', milisec: 59400000},
    {name: '17:00', time: '17:00', milisec: 61200000},
    {name: '17:30', time: '17:30', milisec: 63000000},
    {name: '18:00', time: '18:00', milisec: 64800000},
    {name: '18:30', time: '18:30', milisec: 66600000},
    {name: '19:00', time: '19:00', milisec: 68400000},
    {name: '19:30', time: '19:30', milisec: 70200000},
    {name: '20:00', time: '20:00', milisec: 72000000},
    {name: '20:30', time: '20:30', milisec: 73800000},
  ];
  const [times, setTimes] = useState(time);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const millisecondsSinceStartOfDay = (hours * 60 * 60 + minutes * 60) * 1000;

    let updatedTimes;

    if (indexDay > 0) {
      updatedTimes = time;
    } else {
      updatedTimes = time.filter((item, index) => {
        if (index === 0) {
          return true;
        }
        return item.milisec >= millisecondsSinceStartOfDay;
      });

      if (updatedTimes.length === 1) {
        const hasValidTime = time.some(
          (item, index) =>
            index !== 0 && item.milisec >= millisecondsSinceStartOfDay,
        );
        if (!hasValidTime) {
          updatedTimes = [time[0]];
          setIndexTime(0);
        }
      }
    }

    setTimes(updatedTimes);
  }, [indexDay]);

  useEffect(() => {
    setCurrentTime(time[indexTime].time);
  }, [indexTime]);

  useEffect(() => {
    setCurrentDay(day[indexDay].date);
  }, [indexDay]);

  const day = [
    {name: 'Hôm nay', date: formatDate(timeNow)},
    {name: 'Ngày mai', date: formatDate(timeTomorrow)},
    {name: formatDate(timeAfterTomorrow), date: formatDate(timeAfterTomorrow)},
  ];

  return (
    <View style={styles.body}>
      <View style={styles.carouselContainer}>
        <ItemCarousel
          data={day}
          setIndexSelect={setIndexDay}
          indexSelect={indexDay}
        />
        <ItemCarousel
          data={times}
          setIndexSelect={setIndexTime}
          indexSelect={indexTime}
        />
      </View>
      <View style={styles.overlayBox} />
    </View>
  );
};

const ItemCarousel = ({data, setIndexSelect, indexSelect}) => {
  const carouselRef = useRef(null);

  const handlePress = index => {
    setIndexSelect(index);
    carouselRef.current.scrollTo({index, animated: true});
  };

  return (
    <View>
      {data.length === 1 ? (
        <View style={styles.carouselItem1}>
          <Text style={[styles.carouselText1, styles.carouselTextActive]}>
            {data[0].name}
          </Text>
        </View>
      ) : (
        <Carousel
          ref={carouselRef}
          loop
          vertical
          height={140}
          data={data}
          scrollAnimationDuration={500}
          easing={Easing.out(Easing.exp)}
          animationOptions={{
            friction: 4,
            tension: 40,
          }}
          removeClippedSubviews={true}
          width={width / 2.5}
          pagingEnabled={false}
          snapEnabled={true}
          mode="parallax"
          onSnapToItem={index => setIndexSelect(index)}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => handlePress(index)}>
              <View style={styles.carouselItem}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.carouselText,
                    indexSelect === index && styles.carouselTextActive,
                  ]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          containerStyle={styles.carousel}
        />
      )}
    </View>
  );
};

const formatDate = timestamp => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.overlay,
    flex: 1,
  },
  innerContainer: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
  },
  confirmButton: {
    margin: GLOBAL_KEYS.PADDING_SMALL,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  headerTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.gray900,
    textAlign: 'center',
  },
  headerTime: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  closeButton: {
    position: 'absolute',
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    backgroundColor: colors.fbBg,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    right: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  body: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  carouselContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
  },
  overlayBox: {
    backgroundColor: colors.fbBg,
    width: width - GLOBAL_KEYS.PADDING_SMALL * 2,
    height: 50,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    marginBottom: 3,
  },
  carousel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 55,
  },
  carouselItem1: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    width: width / 3,
  },
  carouselText: {
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
  },
  carouselText1: {
    fontWeight: '500',
    fontSize: 14,
    color: 'black',
    padding: 1,
  },
  carouselTextActive: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default ConfirmDeliveryTimeScreen;
