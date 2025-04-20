
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants';

export const ButtonGroup = ({ titles, tabIndex, onTabChange }) => {
    return (
        <View style={styles.tabContainer}>
            {titles.map((title, index) => (
                <Pressable
                    key={index}
                    style={[
                        styles.tabItem,
                        tabIndex === index && styles.activeTab, // Border bottom khi active
                    ]}
                    onPress={() => onTabChange(index)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            tabIndex === index ? styles.activeText : styles.inactiveText,
                        ]}
                    >
                        {title}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({

    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
        marginHorizontal: 16,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '500',
    },
    activeText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    inactiveText: {
        color: colors.gray700,
    },
})