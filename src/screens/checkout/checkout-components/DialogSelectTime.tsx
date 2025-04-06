import React, { useState, useEffect } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import { Icon } from 'react-native-paper';
import { Column, OverlayStatusBar, PrimaryButton, Row, TitleText } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { TimeInfo } from '../../../type/checkout';

interface DialogSelectTimeProps {
    visible: boolean,
    onClose: () => void,
    onConfirm: (value: TimeInfo) => void
}

export const DialogSelectTime: React.FC<DialogSelectTimeProps> = ({
    visible = true,
    onClose,
    onConfirm
}) => {
    const dateOptions = ["Hôm nay", "Ngày mai"];
    const [selectedDay, setSelectedDay] = useState(dateOptions[0]);
    const [timeSlots, setTimeSlots] = useState(generateTimeSlots(selectedDay));
    const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

    useEffect(() => {
        const newTimeSlots = generateTimeSlots(selectedDay);
        setTimeSlots(newTimeSlots);
        setSelectedTime(newTimeSlots[0]);
    }, [selectedDay]);

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContainer} onPress={() => { }}>
                    <OverlayStatusBar />
                    <Row style={styles.header}>
                        <View style={styles.placeholderIcon} />
                        <TitleText style={styles.headerTitle} text='Chọn thời gian' />
                        <TouchableOpacity onPress={onClose}>
                            <Icon source="close" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
                        </TouchableOpacity>
                    </Row>

                    <Column style={styles.body}>
                        <Row >
                            <Column style={styles.dateColumn}>
                                {dateOptions.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.dayItem, selectedDay === item && styles.selectedDayItem]}
                                        onPress={() => setSelectedDay(item)}
                                    >
                                        <TitleText
                                            text={item}
                                            style={{color: selectedDay === item ? colors.black : colors.gray400}}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </Column>

                            <FlatList
                                data={timeSlots}
                                keyExtractor={(item) => item}
                                showsVerticalScrollIndicator={false}
                                style={styles.timeList}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.timeItem, selectedTime === item && styles.selectedTimeItem]}
                                        onPress={() => setSelectedTime(item)}
                                    >
                                        <TitleText
                                            text={item}
                                            style={[
                                                styles.timeText,
                                                selectedTime === item && styles.selectedTimeText
                                            ]}
                                        />
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.timeListContent}
                            />
                        </Row>

                        <PrimaryButton
                            title='Xác nhận'
                            onPress={() => {
                                const fulfillmentDateTime = calculateFulfillmentDateTime(selectedDay, selectedTime);
                                onConfirm({ selectedDay, selectedTime, fulfillmentDateTime });
                            }}
                        />
                    </Column>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const generateTimeSlots = (selectedDay: string) => {
    let timeList: string[] = [];
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    if (selectedDay === "Hôm nay") {
        timeList.push("Sớm nhất có thể");

        if (minute < 30) {
            minute = 30;
        } else {
            hour += 1;
            minute = 0;
        }

        while (hour < 24) {
            timeList.push(`${hour.toString().padStart(2, '0')}:${minute === 0 ? "00" : "30"}`);
            if (minute === 0) {
                minute = 30;
            } else {
                minute = 0;
                hour += 1;
            }
        }
    } else {
        for (let h = 8; h < 24; h++) {
            timeList.push(`${h.toString().padStart(2, '0')}:00`);
            timeList.push(`${h.toString().padStart(2, '0')}:30`);
        }
    }

    return timeList;
};

const calculateFulfillmentDateTime = (selectedDay: string, selectedTime: string) => {
    const now = new Date();
    const fulfillmentDate = new Date(now);

    if (selectedDay === "Ngày mai") {
        fulfillmentDate.setDate(now.getDate() + 1);
        fulfillmentDate.setHours(8, 0, 0, 0);
    }

    if (selectedTime !== "Sớm nhất có thể") {
        const [hour, minute] = selectedTime.split(":").map(Number);
        fulfillmentDate.setHours(hour, minute, 0, 0);
    }

    return fulfillmentDate.toISOString();
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.overlay,
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        paddingBottom: 24,
        width: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        borderBottomWidth: 2,
        borderBottomColor: colors.gray200,
        backgroundColor: colors.white,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    headerTitle: {
        color: colors.primary,
    },
    placeholderIcon: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        backgroundColor: colors.transparent,
    },
    body: {
        padding: 16,
        gap: 16,
    },

    dateColumn: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    dayItem: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: colors.white,
        width: '100%',
    },
    selectedDayItem: {
        backgroundColor: colors.white,
    },
    dayText: {
        color: colors.gray400,
        textAlign: 'center',
    },
    selectedDayText: {
        color: colors.black,
    },
    timeList: {
        maxHeight: 150,
        flex: 1,
    },
    timeListContent: {
        gap: 10,
    },
    timeItem: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: colors.white,
    },
    selectedTimeItem: {
        backgroundColor: colors.white,
    },
    timeText: {
        color: colors.gray400,
        textAlign: 'center',
    },
    selectedTimeText: {
        color: colors.black,
    },
});
