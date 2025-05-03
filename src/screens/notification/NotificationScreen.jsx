import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getNotifications } from '../../axios';
import { Column, EmptyView, LightStatusBar, NormalHeader, NormalLoading, NormalText } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Toaster } from '../../utils';
const { height, width } = Dimensions.get('window');

const NotificationScreen = (props) => {
  const navigation = props.navigation;
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await getNotifications()
        if (response) {
          setNotifications(response)
        }
      } catch (error) {
        Toaster.show('Error', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])


  const handleItemPress = (item) => {

  };



  return (
    <Column style={styles.container}>
      <LightStatusBar />
      <NormalLoading visible={loading} />
      <NormalHeader
        title="Thông báo"
        onLeftPress={() => navigation.goBack()}
      />
      {
        notifications.length === 0 ?

          <EmptyView /> :

          <FlatList
            scrollEnabled
            showsVerticalScrollIndicator={false}
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Card
                item={item}
                handleItemPress={handleItemPress}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
      }

    </Column>
  );
};

const Card = ({ item, handleItemPress }) => {
  return (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      style={styles.itemContainer}>

      {
        item.type === 'points' ?

        <Image
        style={styles.image}
        source={require('../../assets/images/icon_exchange.png')}
      />
          // <Image source={{ uri: item.image }} style={styles.image} />
          :
          <Image
            style={styles.image}
            source={require('../../assets/images/icon_score.png')}
          />
      }


      <Column style={styles.textContainer}>
        <NormalText text={item.title} style={styles.title} />


        <NormalText
          style={styles.date}
          text={moment(item.createdAt).utcOffset(7).format('HH:mm - DD/MM/YYYY')} />

        <NormalText text={item.content} />
      </Column>
    </TouchableOpacity>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  listContainer: {
    backgroundColor: colors.fbBg,
    gap: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  image: {
    width: width / 6,
    height: width / 6,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignSelf: 'flex-start'
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
  },
  date: {
    color: colors.earthYellow,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 48,
    marginRight: 4
  },
});
