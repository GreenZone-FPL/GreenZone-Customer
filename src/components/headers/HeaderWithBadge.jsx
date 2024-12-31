import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import IconWithBadge from './IconWithBadge';
import colors from '../../constants/color';
import { Icon } from 'react-native-paper';
import GLOBAL_KEYS from '../../constants/global_keys';


const HeaderWithBadge = (props) => {
  const { title, onBadgePress, isHome } = props;
  return (
    <View style={styles.header}>



      { // Kiểm tra xem có phải trang Home hay không
        // 1. Nếu là trang Home thì đổi Header Chào user
        // 2. Nếu không phải Home thì chỉ hiển thị Header Title
        isHome ? (
          <View style={styles.left}>
            <Image
              source={require('../../assets/images/ic_coffee_cup.png')}
              style={styles.image}
            />
            <Text style={styles.title}>Chào bạn mới</Text>
            <Icon source='hand-wave' color={colors.yellow700} size={GLOBAL_KEYS.ICON_SIZE_SMALL} />
          </View>

        ) : (
          <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
          </View>

        )}


      <View style={styles.right}>
        <IconWithBadge onPress={onBadgePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    width: '100%'
  },
  left: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },

  image: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },

});

export default HeaderWithBadge;
