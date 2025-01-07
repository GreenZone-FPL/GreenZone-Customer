import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import colors from '../constants/color';
import GLOBAL_KEYS from '../constants/globalKeys';
import DialogShippingMethod from './dialogs/DialogShippingMethod';


const TestComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleShow = () => setIsVisible(true);
  const handleHide = () => setIsVisible(false);
  const handleEdit = (option) => console.log(`Editing ${option}`);
  const handleOptionSelect = (option) => setSelectedOption(option);
  return (
    <View style={styles.container}>
      <Button title='Open Modal' onPress={handleShow} />
      <DialogShippingMethod
        isVisible={isVisible}
        selectedOption={selectedOption}
        onHide={handleHide}
        onEditOption={handleEdit}
        onOptionSelect={handleOptionSelect}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  mapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  mapIcon: {
    marginRight: 8,
  },

});

export default TestComponent;
