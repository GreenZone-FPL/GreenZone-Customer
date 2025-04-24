import React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors, GLOBAL_KEYS} from '../../constants';
import {SkeletonBox} from '../../skeletons';
import {Category} from '../../type-interface';
import {Row} from '../containers/Row';
import {Column} from '../containers/Column';

type CategoryMenuProps = {
  loading: boolean;
  categories: Category[];
  onCategorySelect: (item: Category) => void;
};

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  loading,
  categories,
  onCategorySelect,
}) => {
  const NUM_COLUMNS = 4;
  const GAP = 16;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const itemWidth = (SCREEN_WIDTH - GAP * 3) / NUM_COLUMNS;

  if (!loading) {
    return (
      <Column style={{paddingHorizontal: 8, gap: 0, marginVertical: 5 }}>
        {[0, 1].map(row => {
          return (
            <Row key={row} style={{justifyContent: 'space-between'}}>
              {[0, 1, 2, 3].map(item => {
                return (
                  <Column key={item} style={styles.itemContainer}>
                    <SkeletonBox
                      width={65}
                      height={65}
                      borderRadius={40}
                      style={{alignSelf: 'center'}}
                    />
                    <SkeletonBox
                      width={50}
                      height={12}
                      borderRadius={4}
                      style={{alignSelf: 'center'}}
                    />
                  </Column>
                );
              })}
            </Row>
          );
        })}
      </Column>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <Pressable
            style={[styles.itemContainer, {width: itemWidth}]}
            onPress={() => onCategorySelect(item)}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{uri: item.icon, priority: FastImage.priority.normal}}
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
        columnWrapperStyle={{gap: GAP}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    minHeight: 185,
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
