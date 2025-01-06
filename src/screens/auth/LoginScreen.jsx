import { StyleSheet, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { loginApi } from '../../axios/modules'



const LoginScreen = (props) => {
 
  

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/images/login.jpg')} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />

    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export { styles }