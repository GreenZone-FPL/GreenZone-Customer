import PropTypes from 'prop-types'; // Import thư viện PropTypes
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';




const CustomSearchBarPropTypes = {
  placeholder: PropTypes.string,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  onClearIconPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  rightIconColor: PropTypes.string,
  onLeftIconPress: PropTypes.func,
  leftIconColor: PropTypes.string,
  inputStyle: PropTypes.object
};

/**
 *
 * Usage Example
 *  <CustomSearchBar
      placeholder="Tìm kiếm ghi chú..."
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onClearIconPress={() => setSearchQuery('')}
      leftIcon="magnify"
      rightIcon="close"
      style={{ flex: 1, marginRight: 16, elevation: 3 }}
    />
 *
 */
export const CustomSearchBar = ({
  placeholder = "Search",
  searchQuery,
  setSearchQuery,
  onClearIconPress,
  style = {},
  leftIcon = "magnify",
  rightIcon = "close",
  rightIconColor = colors.primary,
  onLeftIconPress,
  leftIconColor = colors.primary,
  inputStyle
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Left Icon */}
      <Pressable onPress={onLeftIconPress}>
        <Icon source={leftIcon} size={24} color={leftIconColor} />
      </Pressable>

      {/* Input */}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Right Icon */}
      {searchQuery ? (
        <Pressable onPress={onClearIconPress}>
          <Icon source={rightIcon} size={24} color={rightIconColor} />
        </Pressable>
      ) : null}
    </View>
  );
};

CustomSearchBar.propTypes = CustomSearchBarPropTypes




const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green100,
    borderRadius: 12,
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    marginHorizontal: 10,
  },
});


