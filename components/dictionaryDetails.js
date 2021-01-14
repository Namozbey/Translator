import { action } from 'mobx'
import { Button } from 'react-native-elements'
import { observer } from 'mobx-react'
import React, { useState, useEffect } from 'react'
import { styles, mainColor } from '../global/globalStyle'
import { WordAdder, CreateNewDic, Notification, Alert } from './animation'
import { FontAwesome, Feather, Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { 
    getId,
    langs,
    setData,
    defaultDics, 
    dictionaries,
    modalVisible, 
    addWordToDic, 
    setStatistics,
    setModalVisible, 
    addWordToDefaultDic, 
} from '../global/globalState'
import { 
    Text, 
    View, 
    Modal, 
    Keyboard,
    TextInput, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
} from 'react-native'

export const DictionaryDetails = observer(({route, navigation}) => {
    let data = []
    let dataUsed = []
    const { id } = route.params
    const [to, setTo] = useState(0)
    const [from, setFrom] = useState(0)
    const [item, setItem] = useState({})
    const [vsbl, setVsbl] = useState(false)
    const [saved, setSaved] = useState(false)
    const [focused, setFocused] = useState(false)
    const [visible, setVisible] = useState(false)
    const [modalText, setModalText] = useState('')
    const [searchText, setSearchText] = useState('')
    const [modalTranslation, setModalTranslation] = useState('')
    const [notificationVisible, setNotificationVisible] = useState(false)
    
    let isSaved = id !== 'saved'
    const { firstLang, lastLang } = langs    

    if(id === 'correct' || id === 'incorrect') {
        let _data = defaultDics.saved
        dictionaries.data.forEach(elm => {
            _data = _data.concat(elm.data)
        })
        data = id === 'correct' ? _data.filter(elm => elm.test === 1) : _data.filter(elm => elm.test === 0)
    } else {
        data = Number.isFinite(+id) ? dictionaries.data[id].data : defaultDics[id]
    }

    useEffect(() => {
        setTo(data.length > 10 ? 10 : data.length)
        setFrom(0)
    }, [data.length])

    if(searchText.length) {
        dataUsed = data.filter(elm => 
            searchText === '' 
            ? true 
            : elm.text.toLowerCase().includes(searchText.toLowerCase()) || 
                elm.translation.toLowerCase().includes(searchText.toLowerCase())
        )
    } else {
        dataUsed = data.slice(from, to)
    }

    // console.log(data)
    const clearHistory = action(() => {
        defaultDics.history = []
        setData()
    })

    const handleDelete = (value, _index) => {
        let index = _index
        if(searchText.length) {
            data.map((elm, i) => {
                if(elm.id === value.id) index = i    
            })
        }
        
        Number.isFinite(+id) 
        ? dictionaries.data[id].data.splice(index, 1)
        : defaultDics[id].splice(index, 1)

        setData()
    }

    const addToSaved = val => {
        let _item = Object.assign({}, val)
        _item.test = -1
        if(addWordToDefaultDic(_item, 'saved')) {
            setSaved(true)
            setStatistics('saved')
        } else {
            setNotificationVisible(true)
        }
    }

    const handleAdd = (val) => {
        setItem(val);
        setVisible(true)
    }

    const create = () => {
        if(modalText.length && modalTranslation.length) {
            if(id === 'saved') {
                addWordToDefaultDic(getItem(), 'saved')
            } else {
                addWordToDic(getItem(), id)
            }
            setModalVisible('dictionary', false)
            setStatistics('saved')
        }
    }

    const setLang = (val) => {
        navigation.navigate('Languages', {position: val, name: 'Dictionary'})
        setModalVisible('dictionary', false)
    }

    const getItem = () => {
        const _item = {
            id: getId(),
            firstLang: firstLang.name,
            lastLang: lastLang.name,
            text: modalText.split('\n').join(''),
            translation: modalTranslation.split('\n').join(''),
            test: -1,
        }

        return _item
    }

    const nextRow = () => {
        if(to !== data.length) {
            let num = to + 10 > data.length ? data.length : to + 10
            setTo(num)
            setFrom(val => val + 10)
        }
    }

    const prevRow = () => {
        if(from !== 0) {
            setFrom(val => val - 10)
            setTo(from)
        }
    }

    return (
        <View style={styles.body}>
            <View style={[styles.main, {paddingBottom: 0}]}>
                {data.length ? (
                    <>
                        <View style={[_styles.search, { borderColor: focused ? mainColor : '#7f8084',}]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesome name="search" size={20} color={focused ? mainColor : '#7f8084'} />
                                <TextInput 
                                    placeholder='Search'
                                    value={searchText}
                                    style={{ marginLeft: 10}}
                                    selectTextOnFocus={true}
                                    onFocus={() => setFocused(true)}
                                    onEndEditing={() => setFocused(false)}
                                    style={{fontSize: 18, marginLeft: 10, width: '80%', color: focused ? mainColor : '#7f8084'}}
                                    onChangeText={setSearchText}
                                />
                            </View>
                            {searchText !== '' &&
                                <TouchableOpacity onPress={() => setSearchText('')}>
                                    <MaterialCommunityIcons name="window-close" size={24} color={focused ? mainColor : '#7f8084'} />
                                </TouchableOpacity>
                            }
                        </View>
                        <ScrollView style={_styles.container}>
                            {dataUsed.map((value, index) => {
                                const { firstLang, lastLang, text, translation, test } = value
                                
                                return (
                                    <View style={_styles.translationContent} key={index}>
                                        <View style={_styles.left}>
                                            <View style={_styles.status}>
                                                <View style={_styles.langs}>
                                                    <Text style={_styles.langText}>{firstLang} - {lastLang}</Text>
                                                </View>
                                                {test === 1 
                                                    ? (<MaterialIcons name="mood" size={26} color='green' />)
                                                    : test === 0 ? (<MaterialIcons name="mood-bad" size={26} color='red' />)
                                                    : (<></>)
                                                }
                                            </View>
                                            <Text style={_styles.text}>
                                                {text}
                                            </Text>
                                            <Text style={_styles.translation}>
                                                {translation}
                                            </Text>
                                        </View>
                                        {id !== 'correct' && id !== 'incorrect' &&
                                        <View>
                                            <TouchableOpacity 
                                                style={_styles.icon}
                                                onPress={() => handleDelete(value, index)}>
                                                <MaterialCommunityIcons name="delete-outline" size={26} color="red" />
                                            </TouchableOpacity>
                                            {isSaved ? (
                                                <TouchableOpacity style={_styles.icon} onPress={() => addToSaved(value)}>
                                                    <Feather name="star" size={24} color={mainColor} />
                                                </TouchableOpacity>
                                            ) : (<></>)}
                                            <TouchableOpacity style={_styles.icon} onPress={() => handleAdd(value)}>
                                                <Entypo name="plus" size={24} color={mainColor} />
                                            </TouchableOpacity>
                                        </View>}
                                    </View>
                                )
                            })}                            
                        </ScrollView>
                        
                        {!searchText.length && 
                        <View style={{paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 0.5, borderColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 14, color: '#000'}}>{from}-{to} of {data.length} phrases</Text>
                            </View>
                            <TouchableOpacity onPress={prevRow} style={{padding: 5}}>
                                <Entypo name="chevron-left" size={20} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={nextRow} style={{padding: 5}}>
                                <Entypo name="chevron-right" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>}

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

                        <Alert
                            visible={modalVisible.history.value}
                            height={155}
                            onBackdropPress={() => setModalVisible('history', false)}
                            backdropColor={mainColor}
                            onPressOk={clearHistory}
                        >
                            Dou you really want to clear history
                        </Alert>

                        <Notification 
                            title='You have already saved'
                            visible={notificationVisible}
                            position='bottom' 
                            type='solid'
                            onDisabled={() => setNotificationVisible(false)}
                        />

                        <Notification 
                            title='Item saved'
                            visible={saved}
                            position='bottom' 
                            type='solid'
                            onDisabled={() => setSaved(false)}
                        />
                    </>
                ) : (
                    <View style={_styles.empty}>
                        <Text style={_styles.textEmpty}>This dictionary is empty</Text>
                    </View>
                )}
                
                <Modal
                    visible={modalVisible.dictionary.value}
                    animationType="slide"
                >
                    <View style={styles.body}>
                        <View style={[styles.main, _styles.modalContainer]}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View>
                                    <View style={_styles.modalHeader}>
                                        <Text style={_styles.modalHeaderText}>Creating custom translation</Text>
                                        <TouchableOpacity onPress={() => setModalVisible('dictionary', false)}>
                                            <MaterialCommunityIcons name="window-close" size={24} color='#000' />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={_styles.modalInputContainer}>
                                        <View style={_styles.modalLang}>
                                            <TouchableOpacity onPress={() => setLang('firstLang')}>
                                                <Text style={_styles.modalLangText}>{firstLang.name} {'>'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={_styles.modalInput}>
                                            <TextInput 
                                                multiline
                                                value={modalText}
                                                placeholder='Type the text'
                                                style={{fontSize: 18, maxHeight: '90%', width: '90%'}}
                                                onChangeText={setModalText}
                                            />
                                            {modalText.length ? (
                                                <TouchableOpacity onPress={() => setModalText('')}>
                                                    <MaterialCommunityIcons name="window-close" size={22} color='#000' />
                                                </TouchableOpacity>
                                            ) : (<></>)}
                                        </View>
                                    </View>
                                    <View style={_styles.modalInputContainer}>
                                        <View style={_styles.modalLang}>
                                            <TouchableOpacity onPress={() => setLang('lastLang')}>
                                                <Text style={_styles.modalLangText}>{lastLang.name} {'>'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={_styles.modalInput}>
                                            <TextInput 
                                                multiline
                                                value={modalTranslation}
                                                placeholder='Type the translation'
                                                style={{fontSize: 18, width: '90%'}}
                                                onChangeText={setModalTranslation}
                                            />
                                            {modalTranslation.length ? (
                                                <TouchableOpacity onPress={() => setModalTranslation('')}>
                                                    <MaterialCommunityIcons name="window-close" size={22} color='#000' />
                                                </TouchableOpacity>
                                            ) : (<></>)}
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{margin: 15}}>
                                <Button 
                                    title='Create' 
                                    onPress={create}
                                    disabled={modalText.length && modalTranslation.length ? false : true}
                                />
                            </View>
                        </View>
                    </View>                    
                </Modal>

            </View>
        </View>
    )
})

const _styles = StyleSheet.create({
    search: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2, 
        paddingTop: 5, 
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    container: {
        flex: 1,
    },
    translationContent: {
        borderBottomWidth: 1,
        borderColor: '#7f8084',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    left: {
        width: '90%',
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    langs: {
        borderColor: '#7f8084',
        borderWidth: 1,
        borderRadius: 8,
        padding: 5,
        marginRight: 5,
    },
    langText: {
        fontSize: 14,
        color: '#7f8084'
    },
    icon: {
        marginVertical: 2
    },
    text: {
        fontSize: 20,
        // marginBottom: 5,
    },
    translation: {
        fontSize: 20,
        color: '#4d4f52'
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textEmpty: {
        fontSize: 20
    },
    modalContainer: {
        minHeight: 400, 
        justifyContent: 'space-between'
    },
    modalHeader: {
        flexDirection: 'row', 
        padding: 15, 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    modalHeaderText: {
        fontWeight: 'bold', 
        fontSize: 20
    },
    modalInputContainer: {
        padding: 15, 
        borderTopWidth: 1, 
        height: '37%'
    },
    modalLang: {
        flexDirection: 'row'
    },
    modalLangText: {
        color: '#046fe5', 
        fontSize: 18
    },
    modalInput: {
        marginTop: 5, 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
})