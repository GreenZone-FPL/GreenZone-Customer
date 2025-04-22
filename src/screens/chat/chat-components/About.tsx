import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { Column, NormalText, Row, TitleText } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';



type Props = {
  handleSuggestionPress: (suggestion: string) => void;
};
export const About: React.FC<Props>= ({handleSuggestionPress}) => {


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

      <View style={styles.suggestionContainer}>
        {suggestions.map((item, index) => (
          <Pressable
            key={index}
            style={styles.suggestionChip}
            onPress={() => handleSuggestionPress(item)}
          >
            <NormalText style={styles.suggestionText} text={item} />
          </Pressable>
        ))}
      </View>
    </Column>
  );
};

export const suggestions = [
  'Gợi ý món tráng miệng',
  'Tôi muốn ăn bánh',
  'Có gì mới hôm nay?',
  'Tôi muốn tỉnh táo',
  'Món phù hợp buổi tối',
  'Thức uống lạnh',
  'Bánh chay',
  'Ăn nhẹ buổi chiều',
];
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
    textAlign: 'center',
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1.5,
    borderWidth: 1,
    borderColor: colors.fbBg
  },
  suggestionText: {
    color: colors.black,
    fontSize: 12,
  },
});
