import React from 'react'
import { observer } from 'mobx-react'
import * as FileSystem from 'expo-file-system'
import { styles, mainColor } from "../global/globalStyle"
import { View, Text, Image, StyleSheet } from 'react-native'

export const Details = observer(({route, navigation}) => {
    // const uri = FileSystem.documentDirectory + 'data.txt'

    // setData()

    // FileSystem.writeAsStringAsync(uri, JSON.stringify({}))
    //     .catch(e => console.log('ERROR: ', e))

    // FileSystem.deleteAsync(uri).catch(e => console.log('ERROR: ', e))

    // FileSystem.readAsStringAsync(uri)
    //     .then(res => console.log('T R U E'))
    //     .catch(e => console.log('ERROR: ', e))

    return (
        <View style={styles.body}>
            <View style={[styles.main, {alignItems: 'center', justifyContent: 'center'}]}>
                <Text style={{fontSize: 23, color: mainColor, fontWeight: 'bold'}}>Creator</Text>
                <Text style={{fontSize: 23, color: mainColor}}>Namoz Ostonayev</Text>
                <Text style={{fontSize: 23, color: mainColor, fontWeight: 'bold', marginTop: 50}}>Contact</Text>
                <View style={{justifyContent: 'flex-start'}}>
                    <View style={{flexDirection: 'row', marginVertical: 5, alignItems: 'center'}}>
                        <Image
                            style={{width: 20, height: 20}}
                            source={require('../assets/icons/google.png')}
                        />
                        <Text style={{fontSize: 18, marginLeft: 10, color: mainColor}}>nostonayev@gmail.com</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: 5, marginLeft: -5, alignItems: 'center'}}>
                        <Image
                            style={{width: 30, height: 30}}
                            source={require('../assets/icons/facebook.png')}
                        />
                        <Text style={{fontSize: 18, marginLeft: 5, color: mainColor}}>Namoz Ostonayev</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: 5, alignItems: 'center'}}>
                        <Image
                            style={{width: 20, height: 20}}
                            source={require('../assets/icons/telegram.png')}
                        />
                        <Text style={{fontSize: 18, marginLeft: 10, color: mainColor}}>+99 893 319 09 60</Text>
                    </View>
                </View>
            </View>
        </View> 
    )
})

const _styles = StyleSheet.create({
    
})