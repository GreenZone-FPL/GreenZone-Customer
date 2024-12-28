 import { StyleSheet, Image, SafeAreaView, Text, View, ScrollView , TouchableOpacity} from 'react-native';
 import React from 'react';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 import Icons from 'react-native-vector-icons/Fontisto';
 import IconAntDesign from 'react-native-vector-icons/AntDesign';
  IconFeather from 'react-native-vector-icons/Feather';




  const CardItem = ({ icon, text, color }) => {
    return (
      <View style={styles.card}>
        <IconFeather name={icon} size={24} color={color} />
        <Text style={styles.cardText}>{text}</Text>
      </View>
    );
  };

  const OtherScreen = (props) => {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.textHeader}>Cá nhân</Text>
          <View style={styles.notification}>
            <View style={styles.itemNotification}>
              <Icon name="ticket-confirmation-outline" size={25} color="#299345" />
            </View>
            <View style={styles.itemNotification}>
              <Icons name="bell" size={25} color="#299345" />
            </View>
          </View>
        </View>









        <ScrollView style={styles.body}>
          <Text style={styles.tittle}>
            Tài khoản
          </Text>
          <View style={styles.extention}>
            <CardItem 
              icon="user" 
              text="Thông tin cá nhân" 
              color="#299345" 
            />
            <CardItem 
              icon="map-pin" 
              text="Địa chỉ" 
              color="#F04C7F" 
            />
          </View>
          <TouchableOpacity>
          <View style={styles.row}>
            <CardItem 
              icon="file-text" 
              text="Lịch sử đơn hàng" 
              color="#FF6924" 
            />
          </View>
          </TouchableOpacity>


          <Text style={styles.tittle}>
            Tiện ích
          </Text>
          <View style={styles.support}>
              <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <IconAntDesign name="setting" size={24} color="#666666" />
                <Text style={styles.title}>Thông tin cá nhân</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />
            <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <IconFeather name="message-circle" size={24} color="#666666" />
                <Text style={styles.title}>Liên hệ góp ý</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />
            <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <IconFeather name="star" size={24} color="#666666" />
                <Text style={styles.title}>Cài đặt</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />
            <TouchableOpacity style={styles.item}>
              <View style={styles.leftSection}>
                <IconAntDesign name="login" size={24} color="#666666" />
                <Text style={styles.title}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    );
  };

  export default OtherScreen;

  const styles = StyleSheet.create({
    separator: {
      height: 1,
      backgroundColor: '#ddd',
      marginVertical: 5,
      width: 352,
      
    },
    support:{
      backgroundColor: '#fff',
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0,
      shadowRadius: 2,
      elevation: 2,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      marginLeft: 10,
      fontSize: 16,
      color: '#333',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    card: {
      flex: 1,
      height: 80,
      backgroundColor: '#fff',
      marginHorizontal: 5,
      borderRadius: 10,
      padding: 10,
      justifyContent: 'space-around',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 1,
      elevation: 1,
    },
    cardText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1c1c1c',
    },
    extention:{
      flexDirection: 'row'
    },
    tittle:{
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
    },
    body:{
      flexDirection: 'column',
      paddingHorizontal: 20,
      marginTop: 15
    },
    textHeader:{
      fontSize: 16,
      fontWeight: 'bold'
    },
    itemNotification: {
    width: 40,
      height: 40,
      marginHorizontal: 3, 
      backgroundColor: '#fff',
      borderRadius: 17, 
      justifyContent: 'center', 
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    notification: {
      flexDirection: 'row',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingVertical: 8
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
  });
