import AuctionHistory from "../../components/AuctionHistory";

const AuctionLessorDetail = ({ route , navigation}) => {
    const { property } = route.params;
    console.log("---------------------------------------")
    return(
        <AuctionHistory
            property={property}
            navigation={navigation}
        />
    )
};



export default AuctionLessorDetail;