import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';

const NormalHeader = props => {
  const {
    title = 'Default Title',
    leftIcon = 'arrow-left',
    rightIcon = 'shopping-outline',
    onLeftPress,
    onRightPress,
    enableRightIcon = false,
  } = props;
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action
        icon={leftIcon}
        onPress={onLeftPress}
        color={colors.black}
      />

      <Appbar.Content title={title} titleStyle={styles.title} />

      {
        // Quyết định có show right icon hay không ?
        enableRightIcon ? (
          <Appbar.Action icon={rightIcon} onPress={onRightPress} />
        ) : (
          <Appbar.Action icon="dots-horizontal" color={colors.white} />
        )
      }
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.black,
  },
});

export default NormalHeader;
