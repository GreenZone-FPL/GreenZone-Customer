import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import * as Iconsax from 'iconsax-react-native';
import {colors, GLOBAL_KEYS} from '../../constants';

const {width} = Dimensions.get('window');

const CardRankPropTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export const CardRank = ({title, icon, style}) => {
  // Lấy icon component từ thư viện dựa trên tên
  const IconComponent = Iconsax[icon];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.containerIcon}>
        {IconComponent ? (
          <IconComponent
            size={44}
            color={colors.primary}
            variant="Bulk" 
          />
        ) : (
          <Text>Icon not found</Text>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

CardRank.propTypes = CardRankPropTypes;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    elevation: 4,
    justifyContent: 'flex-start',
    width: width,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    marginTop: 6,
  },
  containerIcon: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.green200,
    borderRadius: 999,
  },
  title: {
    flex: 1,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    color: colors.gray700,
  },
});
