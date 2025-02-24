import ShowProfile from "../../components/ShowProfile";
import { Alert, View } from  "react- native";
import { supabase } from "../../lib/supabase";

const auctionLessor = async () => {
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        Alert.alert('Error', 'No se pudo obtener al usuario');
        return <View/>;
    }

    if (user) {
        Alert.alert('Usuario', `Usuario: ${user.email}`);
    } else {
        Alert.alert('Hola', "No hay usuario");
    }

    return <View />;
};

export default AuctionLessor;