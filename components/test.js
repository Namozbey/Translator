import React from 'react'
import { observer } from 'mobx-react'
import { styles, mainColor } from '../global/globalStyle'
import { dictionaries, defaultDics } from '../global/globalState'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

export const Test = observer(({route, navigation}) => {

    return (
        <View style={styles.body}>
            <View style={styles.main}>
                <View style={_styles.top}>
                    <Text style={_styles.topText}>
                        Select a dictionary
                    </Text>
                    <View style={_styles.line} />
                </View>
                <ScrollView style={_styles.container}>
                    <TouchableOpacity onPress={() => navigation.navigate('TestDetails', {title: 'Saved', id: 'saved'})} >
                        <View style={[_styles.card, {backgroundColor: '#ea8a27'}]}>
                            <View style={_styles.cardLeft}>
                                <FontAwesome5 name="star" size={22} color='#fff' />
                                <Text style={_styles.cardLeftText}>Saved</Text>
                            </View>                            
                            <Text style={_styles.cardRightText}>{defaultDics.saved.length}</Text>
                        </View>
                    </TouchableOpacity>
                    {dictionaries.data.length ? dictionaries.data.map(({title, data, color}, index) => (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('TestDetails', {title: title, id: index})} 
                            key={index}
                        >
                            <View style={[_styles.card, {backgroundColor: color}]}>
                                <View style={_styles.cardLeft}>
                                    <MaterialCommunityIcons name="file-document-box-outline" size={22} color='#fff' />
                                    <Text style={_styles.cardLeftText}>{title}</Text>
                                </View>                            
                                <Text style={_styles.cardRightText}>{data.length}</Text>
                            </View>
                        </TouchableOpacity>
                    )) : (<></>)}
                </ScrollView>
            </View>
        </View>
    )
})

const _styles = StyleSheet.create({
    top: {
        paddingVertical: 15,
        alignItems: 'center'
    },
    line: {
        borderWidth: 1,
        width: '100%',
        opacity: 0.4
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
        paddingHorizontal: 10, 
        marginTop: 10
    },
    card: {
        width: '100%',
        flexDirection: 'row', 
        paddingVertical: 10, 
        paddingHorizontal: 15,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardLeft: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    cardLeftText: {
        fontSize: 20, 
        color: '#fff', 
        marginLeft: 10
    },
    cardRightText: {
        color: '#fff', 
        fontSize: 20
    },
})