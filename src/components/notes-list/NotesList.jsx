import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';

export const NotesList = ({
  title = "Ghi chú",
  items,
  selectedNotes,
  onToggleNote,
  customNote,
  setCustomNote,
  style
}) => {


  // Chia items thành các nhóm có số lượng là 4 (cho grid 4 cột)
  const chunkedItems = [];
  for (let i = 0; i < items.length; i += 4) {
    chunkedItems.push(items.slice(i, i + 4));
  }

  const handleAddCustomNote = () => {
    if (customNote.trim() && !items.includes(customNote)) {
      onToggleNote(customNote);
      setCustomNote("");
    }
  };

  return (
    <View style={[styles.noteView, style]}>
      <Text style={styles.title}>{title}</Text>

      {/* Grid danh sách ghi chú */}
      <View style={styles.gridContainer}>
        {chunkedItems.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.noteItem,
                  selectedNotes.includes(item) && { backgroundColor: colors.green500 }
                ]}
                onPress={() => onToggleNote(item)}
              >
                <Text style={styles.noteText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Ô nhập ghi chú tùy chỉnh */}

      <TextInput
        style={styles.input}
        placeholder="Nhập ghi chú khác..."
        placeholderTextColor={colors.gray500}
        value={customNote}
        onChangeText={setCustomNote}
        multiline={true}
        textAlignVertical="top"
        returnKeyType="done"

      />


    </View>
  );
};

const styles = StyleSheet.create({
  noteView: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    // padding: GLOBAL_KEYS.PADDING_SMALL,
    gap: 8,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    color: colors.black,
  },
  gridContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    elevation: 3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    minHeight: 80,
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: colors.green500,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
});
