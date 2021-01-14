import React, {useState} from 'react'
import { action } from 'mobx'
import { styles, mainColor } from '../global/globalStyle'
import { Button } from 'react-native-elements'
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { changeTestResult, defaultDics, setStatistics } from '../global/globalState'
import { 
    Text,
    View,
    Modal,
    Keyboard, 
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'

export const Testing = ({visible, closeTest, data, dicId}) => {
    const [index, setIndex] = useState(0)
    const [answer, setAnswer] = useState('')
    const [result, setResult] = useState(-1)
    const [answers, setAnswers] = useState([])
    const [isComplate, setIsComplate] = useState(false)
    const {id, firstLang, text, lastLang, translation, test} = data[index]

    const checkAnswer = () => {
        if(answer.length) {
            if(translation.toLowerCase().trim() === answer.toLowerCase().split('\n').join('').trim()) {
                setAnswers(val => {val[index] = {test: 1, color: '#eeffec', textColor: 'green', title: 'Correct'}; return val})
                data[index].test = 1
                setResult(1)
                setStatistics('test', true)
                
            } else {
                setAnswers(val => {val[index] = {answer: answer.split('\n').join(''), test: 0, color: '#ffe0e0', textColor: 'red', title: 'Incorrect'}; return val})
                data[index].test = 0
                setResult(0)
                setStatistics('test', false)
            }
        }         
    }

    const next = () => {
        setIndex(val => val + 1)
        result === -1 && checkAnswer()
        setResult(-1)
        setAnswer('')
    }

    const complate = () => {
        result === -1 && checkAnswer()
        setIsComplate(true)
    }

    // console.log(dicId, data.length ? data[index].test : 'empty')
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            {!isComplate ? (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.body, {marginTop: 55}]}>
                        <View style={styles.main}>
                            <View style={{flex: 1, minHeight: 210}}>
                                <View style={{paddingHorizontal: 15, paddingVertical: 10, height: '50%', borderBottomWidth: 1, borderColor: '#7f8084', }}>
                                    <View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <View style={_styles.lang}>
                                            <Text style={_styles.langText}>{firstLang}</Text>
                                        </View>
                                    </View>
                                    <ScrollView style={{flex: 1}}>
                                        <Text style={{fontSize: 18, color: mainColor}}>{text}</Text>
                                    </ScrollView>
                                </View>
                                <View style={{paddingHorizontal: 15, paddingVertical: 10, height: '40%'}}>
                                    <View style={{marginBottom: 10, flexDirection: 'row'}}>
                                        <View style={_styles.lang}>
                                            <Text style={_styles.langText}>{lastLang}</Text>
                                        </View>
                                    </View>
                                    <TextInput
                                        multiline
                                        value={answer}
                                        placeholder="Type the translation"
                                        style={{fontSize: 18, minHeight: 0}}
                                        onChangeText={val => {setAnswer(val); setResult(-1)}}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={{marginHorizontal: 15, marginVertical: 10}} onPress={checkAnswer}>
                                <View style={{
                                    backgroundColor:  result === 1 ? 'green' : result === 0 ? 'red' : 'orange',
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    padding: 8,
                                    borderRadius: 5,
                                }}>
                                    <Text style={{fontSize: 18, color: '#fff', marginRight: 5}}>
                                        {result === 1 ? 'Correct' : result === 0 ? 'Incorrect' : 'Check'}
                                    </Text>
                                    {result === 1 
                                        ? (<MaterialIcons name="mood" size={18} color='#fff' />)
                                        : result === 0 ? (<MaterialIcons name="mood-bad" size={18} color='#fff' />)
                                        : (<Entypo name="check" size={18} color="#fff" />)
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingHorizontal: 5, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{color: '#fff', fontSize: 18, position: 'absolute', left: 0, right: 0, textAlign: 'center'}}>
                                {index + 1} / {data.length}
                            </Text>
                            <TouchableOpacity onPress={complate}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Entypo name="stopwatch" size={18} color="#4d90fe" />
                                    <Text style={{color: "#4d90fe", fontSize: 18, marginHorizontal: 4}}>Complete</Text>
                                </View>                        
                            </TouchableOpacity>
                            {data.length !== index + 1 && 
                                <TouchableOpacity onPress={next}>
                                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <Text style={{color: "#4d90fe", fontSize: 18}}>Next</Text>
                                        <Entypo name="chevron-right" size={20} color="#4d90fe" />
                                    </View>                        
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            ) : (
                <View style={[styles.body, {marginTop: 55}]}>
                    <View style={styles.main}>
                        <ScrollView style={{flex: 1}}>
                            {data.map(({firstLang, lastLang, text, translation}, index) => (
                                <View key={index} style={[_styles.translationContent, {backgroundColor:  '#fff'}]}>
                                    <View style={_styles.status}>
                                        <View style={_styles.lang}>
                                            <Text style={_styles.langText}>{firstLang} - {lastLang}</Text>
                                        </View>
                                        {answers[index] 
                                            ? (<Text style={{color: answers[index].textColor, fontSize: 14}}>{answers[index].title}</Text>)
                                            : (<Text style={{fontSize: 14}}>Missed</Text>)
                                        }
                                    </View>
                                    <Text style={_styles.text}>
                                        {text}
                                    </Text>
                                    <Text style={_styles.translation}>
                                        {translation}
                                    </Text>
                                    {answers[index] && answers[index].test === 0 &&
                                        <Text style={{borderTopWidth: 1, color: '#4d4f52', fontSize: 18, borderColor: '#44444454', marginTop: 5, paddingTop: 5}}>
                                            Your answer: {answers[index].answer}
                                        </Text>
                                    }
                                </View>
                            ))}                            
                        </ScrollView>
                        <Button 
                            title='close' 
                            onPress={closeTest}
                            buttonStyle={{margin: 15, borderRadius: 5}}
                        />
                    </View>
                </View>
            ) }           
        </Modal>
    )
}

const _styles = StyleSheet.create({
    lang: {
        borderColor: mainColor,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
    },
    langText: {
        fontSize: 14,
        color: mainColor
    },
    translationContent: {
        borderBottomWidth: 1,
        borderColor: '#7f8084',
        padding: 15,
    },
    left: {
        width: '90%',
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
})