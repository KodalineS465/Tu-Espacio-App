import ShowProfile from "../../components/ShowProfile";
import auth from "@react-native-firebase/auth";
import {Alert, View} from "react-native";

const Auction = () => {

        if (auth().currentUser){
            const usuario = auth().currentUser
            Alert.alert('Error', "usuario"+ usuario);
        }
        else {
            Alert.alert('Hola', "No hay usuario");
        }
    return(
        <View/>
    )
};



export default Auction;
