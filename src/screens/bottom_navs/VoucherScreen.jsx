import { StyleSheet, Image, SafeAreaView } from 'react-native'
import { View, Text } from 'react-native';
import NormalHeader from '../../components/headers/NormalHeader';



const VoucherScreen = (props) => {

  return (

    <SafeAreaView style={styles.container}>

      <Text>Voucher Screen</Text>
      <NormalHeader leftIcon = "abjad-arabic" title={"Voucher Screen"} enableRightIcon={true}/>

    </SafeAreaView>


  )
}

export default VoucherScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }

})









