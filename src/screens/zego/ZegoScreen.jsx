import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

const ZegoScreen = ({ navigation }) => {
    const contacts = [  
        {id: 1, userID: 'auxStream', userName: 'CodeWithAuxStream'},
        {id: 2, userID: 'jDoe', userName: 'John Doe'},
        {id: 3, userID: 'james001', userName: 'James Smith'},
        {id: 4, userID: 'and_rew', userName: 'Andrew Jonas'},
        {id: 5, userID: 'robb_', userName: 'Robb Stark'},
        {id: 6, userID: 'musk__', userName: 'Elon Musk'},
        {id: 7, userID: 'jsnow', userName: 'John Snow'},
        {id: 8, userID: 'hberg', userName: 'Heisenberg'},
        {id: 9, userID: 'john', userName: 'Jonathan'},
    ];


    return(
       <View style={styles.container}>
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={styles.heading}>Contacts</Text>
            </View>
            

            <FlatList
                data={contacts}
                keyExtractor={(item, index) => item.id}
                style={{ flex: 1, marginTop: 20 }}
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingHorizontal: 20 }}
                renderItem={({item}) => <CallingItem item={item} />}
            />
       </View>
    )
}


const CallingItem = ({item}) => {
    const navigation = useNavigation();

    return(
        <View style={styles.callContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={{ uri: `https://i.pravatar.cc/200?u=${item.userName}` }}
                    style={ styles.avatar }
                />
                
                <View style={{ marginLeft: 15 }}>
                    <Text style={styles.name}>{ item.userName }</Text>
                    <Text style={styles.username}>@{item.userID}</Text>
                    <Text style={styles.time}>1 hour ago</Text>
                </View>
            </View>

            <TouchableOpacity 
                onPress={() => navigation.navigate('CallingScreen', { data: item })}
                style={styles.callBtn}
            >
                <Image
                    source={require('../../assets/images/phone.png')}
                    style={{ width: 20, height: 30 }}
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    callContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 18,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.07)'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    name: {
        fontWeight: 'bold',
        color: 'white'
    },
    username: {
        fontSize: 12,
        marginTop: 0,
        color: '#dadada'
    },
    time: {
        fontSize: 9,
        marginTop: 6,
        color: '#bababa'

    },
    callBtn: {
        width: 42,
        height: 42,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ababab'
    }
});

export default ZegoScreen;