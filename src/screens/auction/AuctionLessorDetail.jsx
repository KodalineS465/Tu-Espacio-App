import AuctionHistory from "../../components/AuctionHistory";

const AuctionLessorDetail = ({ route , navigation}) => {
    const { property } = route.params;
    
    console.log("---------------------------------------")
    console.log("Detalles de la propiedad:", property);

    if (!property) {
        return <Text>No se encontró la propiedad.</Text>;
    }

    return(
        <AuctionHistory
            property={property}
            navigation={navigation}
        />
    )
};



export default AuctionLessorDetail;