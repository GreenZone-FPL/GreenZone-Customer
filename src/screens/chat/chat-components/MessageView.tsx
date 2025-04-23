import React from 'react';
import {StyleSheet, Text} from 'react-native';
import moment from 'moment';
import {Column} from '../../../components';
import {colors} from '../../../constants';
import {useHomeContainer} from '../../../containers';
import {IMessage} from '../../../type-interface'
import {SuggestedList} from './SuggestedList';

export const MessageView: React.FC<{item: IMessage}> = ({item}) => {
  const {onNavigateProductDetailSheet, onClickAddToCart} = useHomeContainer();
  const formattedTime = moment(item.timestamp).utcOffset(7).format('HH:mm');
  if (item.type === 'user') {
    return (
      <Column style={[styles.bubble, styles.userBubble]}>
        <Text style={styles.userText}>{item.text}</Text>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </Column>
    );
  } else {
    return (
      <Column style={[styles.bubble, styles.aiBubble]}>
        <Text style={styles.aiText}>{item.text}</Text>
        {item.type === 'ai' && item?.products?.length > 0 && (
          <SuggestedList
            products={item.products}
            onItemClick={onNavigateProductDetailSheet}
            onIconClick={onClickAddToCart}
          />
        )}
      </Column>
    );
  }
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    gap: 3,
  },
  userText: {
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timestamp: {
    fontSize: 10,
    color: colors.black,
    textAlign: 'right',
    marginRight: 12,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.fbBg,
    paddingTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.fbBg,
  },
  aiText: {
    color: colors.black,
    marginBottom: 8,
    marginHorizontal: 10,
  },
});
