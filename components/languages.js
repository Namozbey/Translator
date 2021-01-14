import { action } from 'mobx'
import { observer } from "mobx-react"
import React, { useState } from 'react'
import { styles, mainColor } from "../global/globalStyle"
import { Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { View, ScrollView, Text, StatusBar, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { supported_languages, langs, postRecentlyLangs, getTranslation, setModalVisible } from '../global/globalState'


export const Languages = observer(({route, navigation}) => {
    const { position, text, name = '' } = route.params
    const { data } = supported_languages
    const [focused, setFocused] = useState(false)
    const [searchText, setSearchText] = useState('')

    console.log(name)
    return (
        <View style={styles.body}>
            <StatusBar barStyle="light-content" backgroundColor='#061b38' />
            <View style={styles.main}>
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
                            onChangeText={setSearchText}
                            style={{fontSize: 18, marginLeft: 10, width: '80%', color: focused ? mainColor : '#7f8084'}}
                        />
                    </View>
                    {searchText !== '' &&
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <MaterialCommunityIcons name="window-close" size={24} color={focused ? mainColor : '#7f8084'} />
                        </TouchableOpacity>
                    }
                </View>
                <ScrollView style={_styles.container}>
                    {data.filter(elm => 
                        searchText === '' 
                        ? true 
                        : elm.name.toLowerCase().includes(searchText.toLowerCase())
                    ).map((value, index) => (
                        <View key={index}>
                            <TouchableOpacity onPress={action(() => {
                                langs[position] = value
                                navigation.goBack()
                                name === 'Home' && getTranslation(text)
                                name === 'Dictionary' && setModalVisible('dictionary', true)
                                // console.log(langs.lastLang)
                                postRecentlyLangs()
                            })}>
                                <View style={_styles.card}>
                                    <Text style={_styles.text}>{value.name}</Text>
                                    <Entypo name="chevron-right" size={24} color={mainColor} />
                                </View>
                            </TouchableOpacity>
                            <View style={_styles.line} />
                        </View>                      
                    ))}
                    <View style={_styles.space} />
                </ScrollView>                
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
        paddingHorizontal: 5,
    },
    card: {
        width: '100%',
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 22,
    },
    line: {
        borderBottomWidth: 1,
        borderColor: mainColor,
        opacity: 0.3
    },
    space: {
        padding: 30
    }
})