import { ArrowDown2, Category2, Heart, SearchNormal1 } from 'iconsax-react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Row } from '../containers/Row';

const HeaderOrderPropTypes = {
  title: PropTypes.string,
  onCategoryPress: PropTypes.func,
  onFavoritePress: PropTypes.func,
  onSearchProduct: PropTypes.func,
};

export const HeaderOrder = (props) => {
  const { title, onCategoryPress, onFavoritePress, onSearchProduct } = props;
  return (
    <Pressable style={styles.header} >
      <Pressable style={{flexDirection: 'row', alignItems: 'center', gap: 6}} onPress={onCategoryPress}>
        <Category2 size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} variant="Bulk" />

        <Text style={styles.title}>{title}</Text>

        <ArrowDown2 size={GLOBAL_KEYS.ICON_SIZE_SMALL} color={colors.primary} />
      </Pressable>

      <Row>
        <Pressable onPress={onSearchProduct}>
          <SearchNormal1 size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
        </Pressable>

        <Pressable onPress={onFavoritePress}>
          <Heart size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
        </Pressable>
      </Row>
    </Pressable>
  );
};

HeaderOrder.propTypes = HeaderOrderPropTypes


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    marginBottom: 8,
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


