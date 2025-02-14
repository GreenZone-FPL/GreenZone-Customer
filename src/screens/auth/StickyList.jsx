import { ScrollView, Text, Pressable } from 'react-native';

export default StickyList = () => {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#fff' }}
            stickyHeaderIndices={[0, 2, 3, 4]}>
            <TextEl>sticky 0</TextEl>
            <TextEl>sticky 1</TextEl>
            <TextEl>sticky 2</TextEl>
            <TextEl>sticky 3</TextEl>
            <TextEl>sticky 4</TextEl>
            <Pressable style={{ backgroundColor: 'green', height: 200 }}>
                <Text>sticky 5</Text>
            </Pressable>
            <TextEl>sticky 6</TextEl>
            <TextEl>sticky 7</TextEl>




        </ScrollView>
    );
};

const TextEl = ({ children }) => (
    <Text
        style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 250,
            backgroundColor: '#fff',
        }}>
        {children}
    </Text>
);