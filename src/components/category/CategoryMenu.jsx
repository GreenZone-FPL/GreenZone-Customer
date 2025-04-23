import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, GLOBAL_KEYS } from '../../constants';

export const CategoryMenu = ({ categories, onCategorySelect }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const NUM_COLUMNS = 4;
  const GAP = 16;

  const itemWidth =
    containerWidth > 0
      ? (containerWidth - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS
      : 0;

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.itemContainer, { width: itemWidth }]}
              onPress={() => onCategorySelect(item)}
            >
              <View style={styles.imageContainer}>
                <FastImage
                  source={{ uri: item.icon, priority: FastImage.priority.normal }}
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>

              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={{ gap: GAP }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 6,
    gap: 5,
  },
  imageContainer: {
    borderRadius: 34,
    backgroundColor: colors.green100,
    padding: 16,
  },
  image: {
    width: 34,
    height: 34,
    borderRadius: 34,
  },
  itemName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'center',
  },
});
