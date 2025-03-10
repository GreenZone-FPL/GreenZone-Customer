import { View, Text, ScrollView, Alert, Button, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebView from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { hmacSHA256 } from 'react-native-hmac';
import { updatePaymentStatus } from '../../../axios';

const PayOsScreen = () => {
  return (
    <View>
      <Text>PayOsScreen</Text>
    </View>
  )
}

export default PayOsScreen

const styles = StyleSheet.create({})