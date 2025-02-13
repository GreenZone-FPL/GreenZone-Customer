import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Skeleton } from '@rneui/themed';

const MySkeleton = () => {
    return (
        <View>
            <Skeleton animation="pulse" width={80} height={40} />
            {/* <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={80}
                height={40}
            /> */}
            <Skeleton animation="none" width={80} height={40} style={{margin: 8}} />
        </View>
    )
}

export default MySkeleton

const styles = StyleSheet.create({})