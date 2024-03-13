import styled from "styled-components";
import YelpResult from "@/components/YelpResult";
import {ColorScrollBar, MenuSectionTitle} from "@/components/common";
import {theme} from "@/styles/themes";
import BeatLoader from "react-spinners/BeatLoader";

const YelpResultsList = ({ isLoading = false, list = [], type = 'yelp'}) => {


    return (
        <Container isInterest={type === 'interest'}>
            {type === 'interest' && <MenuSectionTitle> My Interests </MenuSectionTitle>}

            {
                isLoading ?
                    <div>
                        <div>
                            Fetching your interests...
                            <BeatLoader color={theme.lightGreen} />
                        </div>
                    </div> :
                    list?.map((business) =>
                        <YelpResult key={business?.id} business={business} minimal={type === 'interest'}/> )
            }


        </Container>
    )

}


export default YelpResultsList;


const Container = styled.div`
  
    ${ColorScrollBar(theme.ashGrey, 6)} 
    min-width: ${props => props.isInterest ? '350px' : '100%'};
  max-width: ${props => props.isInterest ? '350px' : '100%'};
  min-height: ${props => props.isInterest ? '350px' : '500px'};
  max-height: ${props => props.isInterest ? '350px' : '500px'};
  //min-height: 500px;
  //max-height: 500px;
  overflow-y: auto;
  padding: 18px;
  border-radius: 12px;
  //background-color: red;
  //border: 2px solid red;
  
 
`
