import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import QuantityButton from '../buttons/QuantityButton';
import QuantitySelector from '../buttons/QuantitySelector';

const Selectable = ({
  item,
  quantity,
  selected,
  handlePlus,
  handleMinus,
  activeIconColor = colors.primary,
  activeTextColor = colors.primary

}) => {

  const activeColor = selected ? activeIconColor : colors.gray400;
  const textColor = selected ? activeTextColor: colors.black;


  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {!selected ? (
          < QuantityButton
            iconName='plus'
            onPress={() => { handlePlus(item) }}
            iconColor={activeColor} />
        )
          : (
            <QuantitySelector
              quantity={quantity}
              iconColor={activeColor}
              handlePlus={() => handlePlus(item)}
              handleMinus={() => handleMinus(item)}
            />
          )}
        <Text style={[styles.label, { color: textColor }]}>{item.name}</Text>
      </View>

      {item.price && (
        <Text style={[styles.price, { color: textColor }]}>{item.price}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    marginLeft: GLOBAL_KEYS.PADDING_SMALL,
  },
  price: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  quantityText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
  },
});

export default Selectable;
