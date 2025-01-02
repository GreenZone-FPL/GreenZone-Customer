import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/global_keys';

const CustomSearchBar = (props) => {
  const {
    placeholder = "Search",
    searchQuery,
    setSearchQuery,
    style
  } = props;

  return (
    <Searchbar
      placeholder={placeholder}
      value={searchQuery}
      onChangeText={setSearchQuery}
      icon={() => <Feather name="search" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />}
      clearIcon="close"
      inputStyle={styles.input}
      elevation={1}
      style={[styles.searchBar, style]}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: colors.green100,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT
  },
  input: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});

export default CustomSearchBar;
