import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status_bars/LightStatusBar';
import NormalHeader from '../../components/headers/NormalHeader';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';



const UpdateProfileScreen = (props) => {


  return (
    <SafeAreaView style={styles.container}>
        <LightStatusBar/>
        <View style={styles.paddingview}>
            <NormalHeader  leftIcon = "chevron-left" title = "Cập nhật thông tin"/>
            <View style={styles.tittle}>
                <TouchableOpacity style={styles.avatar} >
                    <View style={styles.camera}>
                        <Feather name="camera" size={GLOBAL_KEYS.ICON_SIZE_SMALL} color={colors.gray700}  />
                    </View>
                </TouchableOpacity>
            </View>

           

        </View>
        
    </SafeAreaView>
    
  )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column'
    },
    paddingview:{
        paddingHorizontal: 16
    },
    tittle:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar:{
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: colors.gray300,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    camera:{
        position: 'absolute',
        bottom: 0,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
})