import PropTypes from 'prop-types';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import PagerView from 'react-native-pager-view';

const width = Dimensions.get('window').width;

import {GLOBAL_KEYS, colors} from '../../constants';

export const Carousel = props => {
  Carousel.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        image: PropTypes.string.isRequired,
      }),
    ).isRequired,
    time: PropTypes.number.isRequired,
    dotFlexDirection: PropTypes.oneOf(['row', 'column']),
    dotJustifyContent: PropTypes.oneOf([
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
      'space-evenly',
    ]),
    dotMarginVertical: PropTypes.number,
    dotWidth: PropTypes.number,
    dotHeight: PropTypes.number,
    dotBorderRadius: PropTypes.number,
    dotBackgroundColor: PropTypes.string,
    dotMarginHorizontal: PropTypes.number,
    dotSelectedBackgroundColor: PropTypes.string,
  };

  const {
    data,
    time,
    dotFlexDirection,
    dotJustifyContent,
    dotMarginVertical,
    dotWidth,
    dotHeight,
    dotBorderRadius,
    dotBackgroundColor,
    dotMarginHorizontal,
    dotSelectedBackgroundColor,
  } = props;

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

      <View
        style={[
          styles.dotsContainer,
          {
            flexDirection: dotFlexDirection || 'row',
            justifyContent: dotJustifyContent || 'center',
            marginVertical: dotMarginVertical || GLOBAL_KEYS.PADDING_SMALL,
          },
        ]}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth || GLOBAL_KEYS.ICON_SIZE_SMALL / 2,
                height: dotHeight || GLOBAL_KEYS.ICON_SIZE_SMALL / 4,
                borderRadius:
                  dotBorderRadius || GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
                backgroundColor:
                  currentPage === index
                    ? dotSelectedBackgroundColor || colors.primary
                    : dotBackgroundColor || colors.gray200,
                marginHorizontal:
                  dotMarginHorizontal || GLOBAL_KEYS.PADDING_SMALL,
              },
            ]}
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  dot: {
    width: GLOBAL_KEYS.ICON_SIZE_SMALL / 2,
    height: GLOBAL_KEYS.ICON_SIZE_SMALL / 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.gray200,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
  },
});
