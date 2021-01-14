import { action } from 'mobx'
import { observer } from "mobx-react"
import { styles, mainColor } from "../global/globalStyle"
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useState, useEffect } from 'react'
import { CreateNewDic, Notification, WordAdder } from './animation'
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Entypo, Feather } from '@expo/vector-icons'
import { 
    langs, 
    setId,
    getId,
    getData,
    translation, 
    setStatistics,
    getTranslation, 
    getRecentlyLangs, 
    postRecentlyLangs, 
    addWordToDefaultDic,
} from "../global/globalState"
import { 
    Text, 
    View, 
    Keyboard, 
    StatusBar, 
    Clipboard,
    TextInput, 
    ScrollView, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
} from 'react-native'

export const Home = observer(({route, navigation}) => {
    const [vsbl, setVsbl] = useState(false)
    const [text, setText] = useState('')
    const [copy, setCopy] = useState(false)
    const [saved, setSaved] = useState(false)
    const [visible, setVisible] = useState(false)
    const [editable, setEditable] = useState(false)
    const [notificationVisible, setNotificationVisible] = useState(false)

    const {firstLang, lastLang} = langs

    if(text === '') translation.result = ''

    const handleSave = () => {
        let bool = addWordToDefaultDic(getItem(), 'saved')
        setNotificationVisible(!bool)
        setSaved(bool)
        bool && setStatistics('saved')
    }

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        getRecentlyLangs()
        setId()
        getData()
    }, [])

    useEffect(() => {
        getTranslation(text.split('\n').join(''));
        setSaved(false)
        setNotificationVisible(false)
        setEditable(false)
        setCopy(false)
    }, [text])

    const item = {
        id: '',
        firstLang: firstLang.name,
        lastLang: lastLang.name,
        text: text.split('\n').join(''),
        translation: translation.result.split('\n').join(''),
        test: -1,
    }

    const getItem = () => {
        item.id = getId()

        return item
    }

    const copyToClipboard = () => {
        Clipboard.setString(translation.result)
        setCopy(true)
    }

    const langExchanger = action(() => {
        let additional = langs.lastLang
        langs.lastLang = langs.firstLang
        langs.firstLang = additional

        if(text !== '') {
            setText(translation.result)
            getTranslation(text)
        }
        postRecentlyLangs()
    })

    return (
        <View style={styles.body}>
            <StatusBar barStyle="light-content" backgroundColor={mainColor} />
            <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
                <View style={styles.main}>                
                    <View style={styles.choosenLangs} >
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Languages', {position: 'firstLang', text: text, name: 'Home'})}
                            style={styles.firstLang}
                        >
                            <Text style={styles.choosenLang}>{firstLang.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={langExchanger} style={styles.exchangeIcon}>
                            <FontAwesome5 name="exchange-alt" size={24} color={mainColor} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Languages', {position: 'lastLang', text: text, name: 'Home'})}
                            style={styles.lastLang}
                        >
                            <Text style={styles.choosenLang}>{lastLang.name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.col}>
                        <View style={styles.cardLeft}>
                            <TextInput 
                                multiline
                                value={text.toString()}
                                placeholder='Type some words'
                                onChangeText={setText}
                                style={styles.text}
                            />
                        </View>
                        <View style={styles.cardRight}>
                            <TouchableOpacity onPress={() => setText('')}>
                                <MaterialCommunityIcons name="window-close" size={24} color='#000' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.translationResult}>
                        {/* <ScrollView style={styles.cardLeft}>
                            <Text style={styles.text}>{translation.result}</Text>
                        </ScrollView> */}
                        <View style={styles.cardLeft}>
                            <TextInput 
                                multiline
                                value={translation.result}
                                editable={editable}
                                onChangeText={action(val => translation.result = val)}
                                style={styles.text}
                            />
                        </View>
                        {text.length ? 
                        (<View style={styles.cardRight}>
                            <TouchableOpacity style={styles.translationIcon} onPress={handleSave}>
                                <Feather name="star" size={24} color={saved ? '#ea8a27' : mainColor} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.translationIcon} onPress={() => setVisible(visible ? false : true)}>
                                <Entypo name="plus" size={24} color={mainColor} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.translationIcon} onPress={copyToClipboard}>
                                <MaterialIcons name="content-copy" size={24} color={copy ? '#357ae8' : mainColor} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.translationIcon} onPress={() => setEditable(val => !val)}>
                                <MaterialIcons name="mode-edit" size={24} color={editable ? '#357ae8' : mainColor} />
                            </TouchableOpacity>
                        </View>) : (<></>)}
                    </View>
                    
                    <WordAdder
                        visible={visible}
                        onBackdropPress={() => setVisible(false)}
                        backdropColor={mainColor}
                        onPressPlus={() => setVsbl(true)}
                        item={item}
                    />
                    
                    <CreateNewDic
                        visible={vsbl}
                        onBackdropPress={() => {setVisible(true); setVsbl(false)}}
                        backdropColor={mainColor}
                    />
                    
                    <Notification 
                        title='You have already saved'
                        visible={notificationVisible}
                        position='bottom' 
                        type='solid'
                        onDisabled={() => setNotificationVisible(false)}
                    />

                    <Notification 
                        title='Translation copied'
                        visible={copy}
                        position='bottom' 
                        type='solid'
                        onDisabled={() => setCopy(false)}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>        
    )
})