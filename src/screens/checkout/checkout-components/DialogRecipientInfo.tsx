import React from "react";
import { StyleSheet } from "react-native";
import {
    Column,
    DialogBasic,
    NormalInput,
    PrimaryButton
} from '../../../components';
import { colors } from "../../../constants";
import { UserInfo } from "../../../type/checkout";


interface DialogRecipientInfoProps {
    visible: boolean;
    onHide: () => void;
    onConfirm: (userInfo: UserInfo) => void;
}

export const DialogRecipientInfo: React.FC<DialogRecipientInfoProps> = ({
    visible,
    onHide,
    onConfirm
}) => {
    const [name, setName] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [phoneError, setPhoneError] = React.useState('');

    const validate = () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError('Vui lòng nhập tên người nhận!');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!phoneNumber.trim()) {
            setPhoneError('Vui lòng nhập số điện thoại!');
            isValid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            setPhoneError('Số điện thoại phải có đúng 10 chữ số!');
            isValid = false;
        } else {
            setPhoneError('');
        }

        return isValid;
    };

    const handleConfirm = () => {
        if (validate()) {
            onConfirm({ name, phoneNumber });
            setName('');
            setPhoneNumber('');
            setNameError('');
            setPhoneError('');
        }
    };

    return (
        <DialogBasic
            titleStyle={styles.title}
            title="Thay đổi thông tin người nhận"
            isVisible={visible}
            onHide={onHide}
            style={styles.dialogContainer}
        >
            <Column style={styles.content}>
                <NormalInput
                    label="Tên người nhận"
                    required
                    value={name}
                    setValue={setName}
                    placeholder="Nguyễn Văn A"
                    invalidMessage={nameError}
                />
                <NormalInput
                    label="Số điện thoại"
                    required
                    placeholder="0123456789"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                    invalidMessage={phoneError}
                />
                <PrimaryButton title="Cập nhật" onPress={handleConfirm} />
            </Column>
        </DialogBasic>
    );
};

const styles = StyleSheet.create({
    dialogContainer: {
        backgroundColor: colors.white,
    },
    title: {
        color: colors.black,
    },
    content: {
        gap: 12,
        backgroundColor: colors.white,
    },
});
