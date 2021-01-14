import { Entypo } from '@expo/vector-icons'
import { observer } from 'mobx-react'
import { Input, Button } from 'react-native-elements'
import { colors, mainColor } from '../global/globalStyle'
import React, { useRef, useState } from 'react'
import { 
    getId,
    setData,
    addWordToDic, 
    dictionaries, 
    setDictionary, 
    setStatistics, 
} from '../global/globalState'
import { 
    Text,
    View, 
    Keyboard, 
    Animated, 
    ScrollView,
    StyleSheet, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
} from 'react-native'
    
export const Modal = props => {
    const { visible, height, onBackdropPress, backdropColor, children } = props
   
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const OpacityAnim = useRef(new Animated.Value(0)).current;
    const heightAnim = useRef(new Animated.Value(0)).current;
    const topAnim = useRef(new Animated.Value(1500)).current;
    

    if(visible) {
        Animated.timing(fadeAnim, {toValue: 0.7, duration: 500, useNativeDriver: false}).start()
        Animated.timing(OpacityAnim, {toValue: 1, duration: 500, useNativeDriver: false}).start()
        Animated.timing(heightAnim, {toValue: height, duration: 500, useNativeDriver: false}).start()
        Animated.timing(topAnim, {toValue: 0, duration: 0, useNativeDriver: false}).start()
    } else {
        Animated.timing(fadeAnim, {toValue: 0, duration: 500, useNativeDriver: false}).start()
        Animated.timing(OpacityAnim, {toValue: 0, duration: 500, useNativeDriver: false}).start()
        Animated.timing(heightAnim, {toValue: 0, duration: 500, useNativeDriver: false}).start()
        setTimeout(function() {
            Animated.timing(topAnim, {toValue: 1500, duration: 0, useNativeDriver: false}).start()
        }, 500)
    }

    return (
        <Animated.View style={[_styles.container, {top: topAnim}]}>
            <TouchableWithoutFeedback onPress={onBackdropPress}>
                <View style={{flex:1}}></View>
            </TouchableWithoutFeedback>
            <Animated.View 
                style={[
                    _styles.backdrop, 
                    {
                        opacity: fadeAnim, 
                        backgroundColor: backdropColor === undefined ? '#000' : backdropColor,
                    }
                ]}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <Animated.View style={[_styles.modal, {height: heightAnim, opacity: OpacityAnim}]}>
                    {children}
                </Animated.View>
            </TouchableWithoutFeedback>
        </Animated.View>
    )
}

export const Notification = ({ type, position = 'bottom', visible, onDisabled, title }) => {  
    const Anim = useRef(new Animated.Value(-45)).current;
    const Opacity = useRef(new Animated.Value(0)).current;

    if(visible) {
        Animated.timing(Anim, {toValue: 5, duration: 500, useNativeDriver: false}).start()
        Animated.timing(Opacity, {toValue: 1, duration: 500, useNativeDriver: false}).start()

        Animated.sequence([
            Animated.delay(2000),
            Animated.timing(Anim, {toValue: -45, duration: 500, useNativeDriver: false})
        ]).start()

        Animated.sequence([
            Animated.delay(2000),
            Animated.timing(Opacity, {toValue: 0, duration: 500, useNativeDriver: false})
        ]).start()

        setTimeout(function() {
            onDisabled()
        }, 2500)
    } else {
        Animated.timing(Anim, {toValue: -45, duration: 0, useNativeDriver: false}).start()
        Animated.timing(Opacity, {toValue: 0, duration: 0, useNativeDriver: false}).start()
    }

    return (
        <Animated.View style={[
            { 
                borderRadius: 4, 
                padding: 10,
                backgroundColor: type === 'solid' ? mainColor : '#fff',
                position: 'absolute', 
                left: 5,
                zIndex: 2,
                opacity: Opacity,
            }, 
            (position === 'top') ? {top: Anim} : {bottom: Anim}
        ]}>
            <Text style={{color: type === 'solid' ? '#fff' : '#000', fontSize: 16}}>
                {title}
            </Text>
        </Animated.View>
    )
}


export const CreateNewDic = observer(({visible, onBackdropPress, backdropColor}) => {
    const [DicName, setDicName] = useState('')
    const [color, setColor] = useState(colors[0])
    const [err, setErr] = useState(false)

    const addDictionary = () => {
        if(DicName.length < 43 && DicName.length && !dictionaries.data.some(({title}) => title === DicName)) {
            setDictionary(DicName, color);
            onBackdropPress()
            Keyboard.dismiss()
            setErr(false)
            setData()
            // console.log('BOOL: ',!dictionaries.data.some(v => v == DicName))
        } else {
            setErr(true)
        }
    }

    return (
        <Modal
            visible={visible}
            height={230}
            onBackdropPress={onBackdropPress}
            backdropColor={backdropColor}
        >
            <View style={_styles.content}>
                <Input 
                    // multiline
                    placeholder='Type the name of dictionary'
                    onChangeText={setDicName}
                    errorMessage={DicName.length > 42 ? "the name can't be more than 42 symbols" : ''}
                    selectTextOnFocus={true}
                    inputContainerStyle={_styles.modalInput}
                    containerStyle={{paddingHorizontal: 0, paddingVertical: 0}}
                />
                <View style={_styles.colors}>
                    {colors.map((_color, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={{width: '10%', margin: 4}} 
                            onPress={() => setColor(_color)}
                        >
                            <View style={{
                                width: '100%', 
                                aspectRatio: 1, 
                                backgroundColor: _color, 
                                borderRadius: 3,
                                borderColor: 'blue',
                                borderWidth: color === _color ? 1 : 0,
                            }} />
                        </TouchableOpacity>
                    ))}
                </View>
                <Button
                    title='Add'
                    // type="outline"
                    buttonStyle={{ borderRadius: 5, borderWidth: 0 }}
                    onPress={addDictionary}
                    disabled={!DicName.length || !(DicName.length < 43)}
                />
            </View>
        </Modal>        
    )
})


export const WordAdder = observer(({visible, onBackdropPress, backdropColor, onPressPlus, item}) => {
    const [dicIndex, setDicIndex] = useState(-1)
    const [notificationVisible, setNotificationVisible] = useState(false)
    const _item = Object.assign({}, item)

    const getItem = () => {
        _item.id = getId()
        _item.test = -1

        return _item
    }

    const handleSave = () => {
        if(addWordToDic(getItem(), dicIndex)) { 
            onBackdropPress()
            setStatistics('saved')
        } else {
            setNotificationVisible(true)
        }
    }

    return (
        <Modal
            visible={visible}
            height={254}
            onBackdropPress={onBackdropPress}
            backdropColor={backdropColor}
        >
            <Notification 
                title='You have already saved'
                visible={notificationVisible}
                position='bottom' 
                type='solid'
                onDisabled={() => setNotificationVisible(false)}
            />
            <View style={{flex: 1, paddingTop: 20, }}>
                <ScrollView style={{ width: '100%'}}>
                    <TouchableOpacity onPress={() => {onBackdropPress(); onPressPlus()}}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row', 
                                paddingVertical: 7, 
                                paddingHorizontal: 20, 
                                // backgroundColor: dicIndex === index ? '#cdd8e8' : '#fff',
                                alignItems: 'center'
                            }}
                        >
                            <View style={{
                                width: '12%', 
                                aspectRatio: 1, 
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: mainColor,
                            }}>
                                <Entypo name="plus" size={24} color='#fff' />
                            </View>
                            <View style={{width: '88%', paddingLeft: 20, }}>
                                <Text style={{fontSize: 20}}>Create a new dictionary</Text>
                            </View>
                            {/* <View style={{width: '12%', alignItems: 'flex-end'}}>
                                <Text>{data.length}</Text>
                            </View> */}
                        </View>
                    </TouchableOpacity>
                    {dictionaries.data.length ? dictionaries.data.map(({title, color, data}, index) => (
                        <TouchableWithoutFeedback onPress={() => setDicIndex(index)} key={index}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row', 
                                paddingVertical: 7, 
                                paddingHorizontal: 20, 
                                backgroundColor: dicIndex === index ? '#cdd8e8' : '#fff',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    width: '12%', 
                                    aspectRatio: 1, 
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: color,
                                }}>
                                    <Text 
                                        style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}
                                    >{title[0].toUpperCase()}</Text>
                                </View>
                                <View style={{width: '76%', paddingLeft: 20, }}>
                                    <Text style={{fontSize: 20}}>{title}</Text>
                                </View>
                                <View style={{width: '12%', alignItems: 'flex-end'}}>
                                    <Text>{data.length}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )) : (<></>)}
                </ScrollView>
            </View>
            <Button
                title='Save'
                buttonStyle={{ borderRadius: 5, borderWidth: 0, margin: 20 }}
                onPress={handleSave}
                disabled={dicIndex === -1 ? true : false}
            />                        
        </Modal>
    )
})


export const Alert = props => {
    const {visible, height, onBackdropPress, backdropColor, onPressOk, children} = props

    return (
        <Modal
            visible={visible}
            height={height}
            onBackdropPress={onBackdropPress}
            backdropColor={backdropColor}
        >
            <View style={{flex: 1, padding: 20, justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
                        {children}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        title='Cancel'
                        // type='outline'
                        buttonStyle={{width: 120, borderRadius: 5, borderWidth: 0 }}
                        onPress={onBackdropPress}
                    />
                    <Button
                        title='Delete'
                        // type='outline'
                        // titleStyle={{color: 'red', fontSize: 18}}
                        buttonStyle={{width: 120, borderRadius: 5, borderWidth: 0, backgroundColor: 'red'}}
                        onPress={() => {onPressOk(); onBackdropPress()}}
                    />
                </View>
            </View>
            
        </Modal>
    )
}


const _styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        overflow: 'hidden',
    },
    backdrop: {
        width: '100%',
        position: 'absolute',
        borderRadius: 4,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    modal: {
        marginTop: 4,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    modalInput: {
        borderColor: 'rgba(6, 27, 56, 0.7)',
        borderWidth: 2, 
        borderRadius: 5, 
        borderBottomWidth: 2, 
        padding: 5,
        // marginBottom: -26,
    },
    colors: {
        width: '100%',
        flexDirection: 'row',
        // flexWrap: 'wrap',
        justifyContent: 'center',
    }
})