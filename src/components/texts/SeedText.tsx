import React from "react"
import { colors, GLOBAL_KEYS } from "../../constants"
import { Row } from "../containers/Row"
import { NormalText } from "./NormalText"
import { Image, StyleSheet, ViewProps, ViewStyle } from 'react-native'
import { TextFormatter } from "../../utils"

interface SeedTextProps {
    point: number,
    textStyle: ViewStyle,
    enableImage?: boolean
}

export const SeedText: React.FC<SeedTextProps> = ({
    point,
    textStyle,
    enableImage = true
}) => {
    return (
        <Row>
            {enableImage ? (
                <Image
                    style={styles.iconSeed}
                    source={require('../../assets/seed/icon_seed.png')}
                />
            ) : (
                <NormalText
                    style={[styles.text, textStyle]}
                    text="Seed"
                />
            )}
            <NormalText
                style={[styles.text, textStyle]}
                text={TextFormatter.formatted(point)}
            />
        </Row>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: '500',
        color: colors.primary
    },
    iconSeed: {
        width: 24,
        height: 24,
        borderRadius: 48,
        marginRight: 4
    },
});
