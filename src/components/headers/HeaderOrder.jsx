import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import PropTypes from 'prop-types'
import { Category2, ArrowCircleDown, Heart, SearchNormal1 } from 'iconsax-react-native';

const HeaderOrderPropTypes = {
  title: PropTypes.string,
  onCategoryPress: PropTypes.func,
  onFavoritePress: PropTypes.func,
  onSearchProduct: PropTypes.func,
};

export const HeaderOrder = (props) => {
  const { title,onCategoryPress , onFavoritePress , onSearchProduct} = props;
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Category2 size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} variant="Bulk" />
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onCategoryPress}>
          <ArrowCircleDown
            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            color={colors.primary}
            variant="Bulk"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={onSearchProduct}>
          <SearchNormal1
           size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity  onPress={onFavoritePress}>
          <Heart
            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>


    </View>
  );
};

HeaderOrder.propTypes = HeaderOrderPropTypes


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: 4,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,

  },
  left: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.black,
  },

  image: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },

});


