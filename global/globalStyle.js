import { StyleSheet } from 'react-native'

export let mainColor = "#061b38"
export const colors = ['#e6096f', '#ce09e6', '#0910e6', '#09dce6', '#21e609', '#e6c109', '#e63c09', '#000']

export const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 5,
    paddingTop: 0,
    backgroundColor: mainColor,
    // height: 511
    // borderBottomColor: 'blue',
    // borderBottomWidth: 1,
    // marginBottom: 0
  },
  main: {
    // height: '100%',
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 4,
    overflow: 'hidden',
  },
  headerIcon: {
    paddingHorizontal: 10,
    marginRight: 5,
    // flexDirection: 'row'
  },
  choosenLangs: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  choosenLang: {
    fontSize: 18,
    color: mainColor
  },
  firstLang: {
    width: '42%',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  exchangeIcon: {
    width: '16%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lastLang: {
    width: '42%',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  col: {
    width: '100%',
    height: '35%',
    minHeight: 85,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: mainColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  translationResult: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    minHeight: 80,
  },
  cardLeft: {
    width: '90%',
    paddingRight: 10,
  },
  cardRight: {
    // opacity: 0.5,
  },
  text: {
    fontSize: 18
  },
  translationIcon: {
    marginVertical: 5,
    padding: 2
  }
});
