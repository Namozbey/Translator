import { Entypo } from '@expo/vector-icons'
import { Button } from 'react-native-elements'
import { Testing } from './testing'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { styles, mainColor } from '../global/globalStyle'
import { dictionaries, defaultDics, getId } from '../global/globalState'
import { 
    Text, 
    View, 
    Switch,
    Keyboard, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    TouchableHighlight, 
    TouchableWithoutFeedback, 
} from 'react-native'

export const TestDetails = observer(({route, navigation}) => {
    const { id } = route.params
    const data = Number.isFinite(+id) ? dictionaries.data[id].data : defaultDics[id]
    const [to, setTo] = useState(data.length > 30 ? 30 : data.length)
    const [from, setFrom] = useState(0)
    const [shuffle, setShuffle] = useState(false)
    const [testData, setTestData] = useState(data)
    const [testVisible, setTestVisible] = useState(false)

    const increase = value => {
        if(value === 'from') {
            let result = from + 5
            if(result >= to) result = to - 1 
            setFrom(result)
        } else {
            let result = to + 5
            if(result > data.length) result = data.length
            setTo(result)
        }
    }

    const reduce = value => {
        if(value === 'from') {
            let result = from - 5
            if(result < 0) result = 0 
            setFrom(result)
        } else {
            let result = to - 5
            if(result <= from) result = from + 1
            setTo(result)
        }
    }

    const onChangeFrom = val => {
        let result = +val
        if(+val >= to) {
            result = to - 1
        } else if(+val < 0) {
            result = 0
        }
        setFrom(result)
    }

    const onChangeTo = val => {
        let result = +val
        if(+val <= from) {
            result = from + 1
        } else if(+val > data.length) {
            result = data.length
        }
        setTo(result)
    }

    const start = () => {
        let _data = []
        for(let i=from; i<to; i++) {
            _data.push(data[i])
        }
        if(shuffle) {
            let __data = []
            let len = _data.length
            for(let i=0; i<len; i++) __data.push(_data.splice(parseInt(Math.random() * _data.length), 1)[0])
            setTestData(__data)
        } else {
            setTestData(_data)
        }
        setTestVisible(true)
    }

    return (
        <View style={styles.body}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
                <View style={styles.main}>
                    {data.length ? (
                        <View style={_styles.container}>
                            <View>
                                <View style={_styles.top}>
                                    <Text style={_styles.topText}>
                                        {data.length} {data.length === 1 ? 'phrase' : 'phrases'}
                                    </Text>
                                    <View style={_styles.line} />
                                </View>
                                <View style={_styles.row}>
                                    <View style={_styles.col}>
                                        <View style={_styles.fromToContent}>
                                            <Text style={{fontSize: 22}}>From</Text>
                                            <View style={_styles.input}>
                                                <TextInput 
                                                    placeholder='From'
                                                    value={`${from}`}
                                                    onChangeText={setFrom}
                                                    keyboardType='numeric'
                                                    style={{fontSize: 20}}
                                                    onEndEditing={({nativeEvent}) => onChangeFrom(nativeEvent.text)}
                                                />
                                                <View>
                                                    <TouchableOpacity onPress={() => increase('from')}>
                                                        <Entypo name="chevron-up" size={20} color="black" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => reduce('from')}>
                                                        <Entypo name="chevron-down" size={20} color="black" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <Text style={_styles.dash}>-</Text>
                                        <View style={_styles.fromToContent}>
                                            <Text style={{fontSize: 22}}>To</Text>
                                            <View style={_styles.input}>
                                                <TextInput 
                                                    placeholder='From'
                                                    value={`${to}`}
                                                    onChangeText={setTo}
                                                    keyboardType='numeric'
                                                    style={{fontSize: 20}}
                                                    onEndEditing={({nativeEvent}) => onChangeTo(nativeEvent.text)}
                                                />
                                                <View>
                                                    <TouchableOpacity onPress={() => increase('to')}>
                                                        <Entypo name="chevron-up" size={20} color="black" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => reduce('to')}>
                                                        <Entypo name="chevron-down" size={20} color="black" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={_styles.shuffle}>
                                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                            <Text style={{fontSize: 22, marginRight: 10}}>Shuffle</Text>
                                            <Entypo name="shuffle" size={22} color="black" />
                                        </View>
                                        <Switch 
                                            onValueChange={() => setShuffle(val => !val)}
                                            value={shuffle}
                                        />
                                    </View>
                                </View>
                            </View>
                            <Button
                                title='Start'
                                buttonStyle={_styles.button}
                                onPress={start}
                                disabled={from.length !== 0 && from < to && to <= data.length ? false : true}
                            />

                            <Testing 
                                visible={testVisible}
                                dicId={id}
                                data={testData}
                                closeTest={() => {setTestVisible(false); navigation.navigate('TestHome')}}
                            />
                        </View>
                    ) : (
                        <View style={_styles.empty}>
                            <Text style={_styles.textEmpty}>This dictionary is empty</Text>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
})

{/* <Entypo name="shuffle" size={24} color="black" /> */}

const _styles = StyleSheet.create({
    top: {
        paddingVertical: 15,
        alignItems: 'center'
    },
    line: {
        borderWidth: 1,
        width: '100%',
        borderColor: '#7f8084',
    },
    topText: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 3,
        top: 0,
        paddingHorizontal: 5,
        fontSize: 18,
        zIndex: 1,
    },
    container: {
        flex: 1, 
        justifyContent: 'space-between'
    },
    row: {
        marginTop: 15,
        paddingHorizontal: 15
    },
    col: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    dash: {
        fontSize: 22, 
        fontWeight: 'bold'
    },
    fromToContent: {
        alignItems: 'center'
    },
    input: {
        marginTop: 5, 
        paddingLeft: 3,
        borderBottomWidth: 1, 
        borderColor: '#7f8084',
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    shuffle: {
        flexDirection: 'row', 
        marginTop: 20, 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    button: { 
        borderRadius: 5, 
        borderWidth: 0, 
        margin: 15 
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textEmpty: {
        fontSize: 20
    },
})