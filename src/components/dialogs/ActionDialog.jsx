import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';

export const ActionDialog = ({
    visible,
    title,
    content,
    onCancel,
    onApprove,
    cancelText,
    approveText,
}) => {
    return (
        <Portal>

            <Dialog
                style={{ borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT, backgroundColor: colors.white }}
                dismissable={false}
                visible={visible}
            >
                <OverlayStatusBar />

                {title && <Dialog.Title>{title}</Dialog.Title>}

                <Dialog.Content>
                    {typeof content === 'string' ? <Text>{content}</Text> : content}
                </Dialog.Content>

                <Dialog.Actions>
                    {onCancel && <Button onPress={onCancel}>{cancelText}</Button>}
                    {onApprove && <Button onPress={onApprove}>{approveText}</Button>}
                </Dialog.Actions>

            </Dialog>
        </Portal>
    );
};

ActionDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    onCancel: PropTypes.func,
    onApprove: PropTypes.func,
    cancelText: PropTypes.string,
    approveText: PropTypes.string,
};

