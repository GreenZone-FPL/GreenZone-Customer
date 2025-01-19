import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {GLOBAL_KEYS, colors} from '../../constants';

const width = Dimensions.get('window').width;

export const CarouselBanner = props => {
  const {data} = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        loop={true}
        width={width}
        height={width / 2.5}
        autoPlay={true}
        data={data}
        scrollAnimationDuration={2000}
        onSnapToItem={index => setActiveIndex(index)}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Image
              source={{uri: item.image}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />

      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT * 1.5,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  dot: {
    width: GLOBAL_KEYS.ICON_SIZE_SMALL,
    height: GLOBAL_KEYS.ICON_SIZE_SMALL / 3,
    backgroundColor: colors.gray200,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});
