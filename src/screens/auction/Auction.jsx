import ShowProfile from "../../components/ShowProfile";
import { supabase } from "../../lib/supabase";
import { Alert, View } from "react-native";

const Auction = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        Alert.alert('Error', "No se pudo obtener el usuario");
    } else if(user) {
        Alert.alert('Usuario', "ID: " + user.id);
    } else {
        Alert.alert('Hola', "No hay usuario");
    }

    return <View/>;
    
};

export default Auction;
