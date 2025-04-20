import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Icon} from 'react-native-paper';

import {Column, NormalText, Row, TitleText} from '../../../components';
import {colors, GLOBAL_KEYS} from '../../../constants';

export const About: React.FC = () => {
  return (
    <Column style={styles.aboutContainer}>
      <Image
        source={require('../../../assets/images/robot.png')}
        style={styles.imageRobot}
      />
      <Row>
        <TitleText text="GreenZone Assistant" style={styles.bigMessage} />
        <Icon source="check-decagram" size={22} color={colors.primary} />
      </Row>

      <NormalText
        style={styles.description}
        text="Trợ lý ảo của GreenZone có thể gợi ý sản phẩm theo mong muốn của bạn!"
      />
    </Column>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    justifyContent: 'center',
    marginVertical: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  bigMessage: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  imageRobot: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  description: {
    color: colors.gray700,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
  },
});
