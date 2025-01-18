import {View, StyleSheet, Dimensions, Image} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import PagerView from 'react-native-pager-view';

const width = Dimensions.get('window').width;

import {GLOBAL_KEYS, colors} from '../../constants';

export const Banner = props => {
  const {data, time} = props;
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(prevPage => (prevPage + 1) % data.length);
    }, time);

    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(currentPage);
    }
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}>
        {data.map(item => (
          <View key={item.id}>
            <Image source={{uri: item.image}} style={styles.image} />
          </View>
        ))}
      </PagerView>

      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentPage === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  pagerView: {
    width: width,
    height: width / 2.5,
  },
  image: {
    width: width - GLOBAL_KEYS.PADDING_DEFAULT * 2,
    height: width / 2.5,
    resizeMode: 'cover',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  dot: {
    width: GLOBAL_KEYS.ICON_SIZE_SMALL / 2,
    height: GLOBAL_KEYS.ICON_SIZE_SMALL / 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.gray200,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});
