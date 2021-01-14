import { action } from 'mobx'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { styles, mainColor } from "../global/globalStyle"
import { CreateNewDic, Alert } from './animation'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { 
    setData,
    defaultDics, 
    modalVisible, 
    dictionaries, 
    setModalVisible, 
} from '../global/globalState'
import { 
    View, 
    Text,
    StatusBar, 
    ScrollView, 
    StyleSheet ,
    TouchableOpacity,
    Keyboard,
} from 'react-native'

export const Dictionary = observer(({route, navigation}) => {
    const [alertVisible, setAlertVisible] = useState(false)
    const [dicIndex, setDicIndex] = useState(-1)

    const deleteDic = action(() => {
        dictionaries.data.splice(dicIndex,1)
        setData()
    })

    return (
        <View style={styles.body}>
            <StatusBar barStyle="light-content" backgroundColor={mainColor} />

            <View style={styles.main}>
                <ScrollView style={_styles.container}>
                    <View style={_styles.liked}>
                        <View style={_styles.col}>
                            <TouchableOpacity onPress={() => navigation.navigate('DictionaryDetails', {title: 'History', id: 'history'})}>
                                <View style={[_styles.card, {backgroundColor: '#173d71'}]}>
                                    <Text style={_styles.text}>History</Text>
                                    <View style={_styles.dicIcon}>
                                        <FontAwesome5 name="history" size={70} color='#fdfeff33' />
                                    </View>
                                    <View style={_styles.dicFooter}>
                                        <View style={_styles.status}>
                                            <Text style={_styles.statusText}>{defaultDics.history.length}</Text>
                                            <Ionicons name="md-list" size={16} color="#fff" />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={_styles.col}>
                            <TouchableOpacity onPress={() => navigation.navigate('DictionaryDetails', {title: 'Saved', id: 'saved'})}>
                                <View style={[_styles.card, {backgroundColor: '#ea8a27'}]}> 
                                    <Text style={_styles.text}>Saved</Text>
                                    <View style={_styles.dicIcon}>
                                        <FontAwesome5 name="star" size={70} color='#fdfeff33' />
                                    </View>
                                    <View style={_styles.dicFooter}>
                                        <View style={_styles.status}>
                                            <Text style={_styles.statusText}>{defaultDics.saved.length}</Text>
                                            <Ionicons name="md-list" size={16} color="#fff" />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={_styles.col}>
                            <TouchableOpacity onPress={() => navigation.navigate('DictionaryDetails', {title: 'Answered correctly', id: 'correct'})}>
                                <View style={[_styles.card, {backgroundColor: '#1eb91b'}]}> 
                                    <Text style={_styles.text}>Answered correctly</Text>
                                    <View style={_styles.dicIcon}>
                                        <MaterialIcons name="mood" size={70} color='#fdfeff33' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={_styles.col}>
                            <TouchableOpacity onPress={() => navigation.navigate('DictionaryDetails', {title: 'Answered incorrectly', id: 'incorrect'})}>
                                <View style={[_styles.card, {backgroundColor: '#ce2f2f'}]}> 
                                    <Text style={_styles.text}>Answered incorrectly</Text>
                                    <View style={_styles.dicIcon}>
                                        <MaterialIcons name="mood-bad" size={70} color='#fdfeff33' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {dictionaries.data.length ? (
                        <View style={_styles.row}>
                        {dictionaries.data.map(({title, data, color}, index) => (
                            <View style={_styles.col} key={index}>
                                <TouchableOpacity onPress={() => navigation.navigate('DictionaryDetails', {title: title, id: index})}>
                                    <View style={[_styles.card, {backgroundColor: color}]}>
                                        <Text style={_styles.text}>{title}</Text>
                                        <View style={_styles.dicIcon}>
                                            <MaterialCommunityIcons name="file-document-box-outline" size={70} color='#fdfeff33' />
                                        </View>
                                        <View style={_styles.dicFooter}>
                                            <View style={_styles.status}>
                                                <Text style={_styles.statusText}>{data.length}</Text>
                                                <Ionicons name="md-list" size={16} color="#fff" />
                                            </View>
                                            <TouchableOpacity 
                                                onPress={() => {setDicIndex(index); setAlertVisible(val => !val)}}
                                                style={{paddingTop: 10, paddingLeft: 10}}
                                            >
                                                <MaterialCommunityIcons name="delete-outline" size={22} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                        </View>
                        ) : (<></>)
                    }                    
                    <View style={_styles.space} />
                </ScrollView>

                <CreateNewDic 
                    visible={modalVisible.dictionaries.value}
                    onBackdropPress={() => setModalVisible('dictionaries', false)}
                    backdropColor={mainColor}
                />
                <Alert
                    visible={alertVisible}
                    height={135}
                    onBackdropPress={() => setAlertVisible(false)}
                    backdropColor={mainColor}
                    onPressOk={deleteDic}
                >
                    Dou you really want to delete
                </Alert>

            </View>
        </View>
    )
})

const _styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    text: {
        color: '#fff',
        marginTop: 10,
        marginHorizontal: 15,
        fontSize: 18,
    },
    liked: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 10,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopWidth: 1,
        borderColor: '#8c9cb1',
        paddingTop: 25,
    },
    col: {
        width: '50%',
        aspectRatio: 3 / 4,
        padding: 5
    },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        backgroundColor: mainColor,
    },
    dicFooter: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        paddingHorizontal: 15,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 4,
    },
    space: {
        padding: 30
    },
    dicIcon: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
})