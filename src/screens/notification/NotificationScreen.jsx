import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { NormalHeader, LightStatusBar, NormalText, PrimaryButton, DualTextRow, NormalLoading, Column, Row } from '../../components';
import { Toaster } from '../../utils';
import { getNotifications } from '../../axios';
import moment from 'moment/moment';
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
        console.log('noti', JSON.stringify(response, null, 2))
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
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalLoading visible={loading} />
      <NormalHeader
        title="Thông báo"
        onLeftPress={() => navigation.goBack()}
      />
      <FlatList
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
    </SafeAreaView>
  );
};

const Card = ({ item, handleItemPress }) => {
  return (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      style={styles.itemContainer}>

      <Image source={{ uri: item.image }} style={styles.image} />

      <Column style={styles.textContainer}>
        <NormalText text={item.title} style={styles.title} />
        <Row>
          {
            item.type === 'points' ?

              <Image
                style={styles.icon}
                source={require('../../assets/seed/icon_seed.png')}
              /> :
              <Image
                style={styles.icon}
                source={require('../../assets/images/ic_order.png')}
              />
          }

          <NormalText
            style={styles.date}
            text={moment(item.createdAt).utcOffset(7).format('HH:mm - DD/MM/YYYY')} />

        </Row>



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
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
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
    color: colors.pink500,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 48,
    marginRight: 4
  },
});
