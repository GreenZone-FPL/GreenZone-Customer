import React from 'react';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import {NormalText, TitleText} from '../../../components';
import {colors} from '../../../constants';
import {TimeInfo} from '../../../type-interface/checkout';

interface TimeSectionProps {
  timeInfo: TimeInfo;
  showDialog: () => void;
  style?: ViewStyle;
}

export const TimeSection: React.FC<TimeSectionProps> = ({
  timeInfo,
  showDialog,
  style,
}) => {
  const isToday = timeInfo?.selectedDay === 'Hôm nay';
  const isEarliest = timeInfo?.selectedTime === 'Sớm nhất có thể';

  return (
    <Pressable onPress={showDialog} style={[styles.container, style]}>
      {timeInfo && timeInfo.fulfillmentDateTime ? (
        <>
          <TitleText
            style={styles.greenText}
            text={`${timeInfo.selectedTime}`}
          />
          <NormalText text={`${timeInfo.selectedDay}`} />
          {isToday && isEarliest && (
            <TitleText text="15-30 phút" style={styles.greenText} />
          )}
        </>
      ) : (
        <>
          <TitleText text="15-30 phút" style={styles.greenText} />
          <NormalText text="Sớm nhất có thể" />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  greenText: {
    color: colors.lemon,
  },
});
