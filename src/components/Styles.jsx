import {StyleSheet} from 'react-native'

const style = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        padding: 10,
    },
    fullContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        width: '100%',
        padding: 10
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        marginTop: 10,
        marginBottom: 30
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        width: '100%',
        paddingBottom: 30
    },
    allInOneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        paddingTop: 20
    },
    inputContainer: {
        width: '80%'
    },
    simpleContainer:{
        width: '60%',
        color: 'black',
        fontWeight: '700',
        fontSize: 14,
        alignItems: 'center',
        marginLeft: 50
    },
    propertyContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        flex: 1
    },
    logo: {
        width: 200,
        height: 150,
        alignItems: 'center',
        marginTop: 50
    },
    textSubtitle: {
        color: 'gray',
        fontWeight: '700',
        fontSize: 17,
        alignItems: 'center'
    },
    textGray: {
        color: 'gray',
        fontSize: 14,
        alignItems: 'center',
    },
    textBlue: {
        color: '#0f0135',
        fontWeight: '700',
        fontSize: 17,
        alignItems: 'center'
    },
    textTitle: {
        color: 'black',
        fontWeight: '700',
        fontSize: 26,
        alignItems: 'center'
    },
    errorstyle: {
        color: 'red',
        fontSize: 14,
        fontWeight: '700',
    },
    filterText: {
        fontSize: 18,
        marginLeft: 20,
        color: '#0f0135',
        marginTop: 20,
        fontWeight: 'bold'
    },
    mediaButton: {
        backgroundColor: '#e6e6e6',
        borderColor: '#e6e6e6',
        borderWidth: 3,
        borderRadius: 5,
        height: 40,
        width: '90%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    mediaText: {
        color: '#0f1035',
        fontSize: 14,
        fontWeight: 'bold'
    },
    selectedPics:{
        width:100,
        height:100,
        margin: 5,
    },
    titleProperty: {
        fontSize: 26,
        color: 'black',
        fontWeight: 'bold',
        paddingBottom: 5
    },
    propertyFull: {
        flex: 1,
    },
    propertyWhite: {
        flex: 1,
        backgroundColor: 'white',
    },
    screenTitle: {
        color: '#0f1035',
        fontSize: 26,
        fontWeight: "bold",
        paddingVertical: 10,
        paddingLeft: 10
    },
    containerModalAddress:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentModalAddress: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20
    },
    row: {
        flexDirection: 'row',
        width: '100%'
    },
    leftContainer: {
        alignItems: 'flex-start',
        paddingLeft: 10,
        width: "75%",
    },
    rightContainer: {
        alignItems: 'flex-end',
        width: "25%",
        paddingHorizontal: 10,
    },
    auxTitle: {
        color: 'gray',
        fontSize: 18,
        paddingVertical: 15
    },
    confirmButton: {
        marginTop: 30,
        backgroundColor: '#4D0303',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    showRecommendationText: {
        color: 'white',
        fontSize: 16,
        paddingLeft: 20,
        paddingTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceContainer:{
        backgroundColor: "#0f1035",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        borderRadius: 5
    }
});


export default style;