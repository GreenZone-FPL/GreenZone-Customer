import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {GLOBAL_KEYS, colors} from '../../constants';



const NormalText = ({text='Normal text',style}) => {

  return (
    <View>
        <Text style={[styles.text,style]}>{text}</Text>
    </View>
  )
}

export default NormalText

const styles = StyleSheet.create({
    text:{
        fontSize:GLOBAL_KEYS.FONT_SIZE_NORMAL,
        color:colors.black
    }
})