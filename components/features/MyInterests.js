import YelpSearch from "@/components/YelpSearch";
import styled from "styled-components";
import {useAppContext} from "@/context/app.context";
import {FlexBox, Gap} from "@/components/common";
import YelpResultsList from "@/components/YelpResultsList";
import Empty from "antd/lib/empty";
import BeatLoader from "react-spinners/BeatLoader";
import {theme} from "@/styles/themes";

const MyInterests = () => {

    const {yelpResults, isSearching} = useAppContext();
    // const {user} = useAuthContext();
    //
    // const {data: interests, isLoading, isFetching} = useUserInterests(user?.id)
    return (
        <Container >
            <YelpSearch />


            <FlexBox wrap={'no-wrap'} justify={'space-between'} gap={48} align={'flex-start'}>
                <FlexBox className={'main-content'} align={yelpResults?.length > 0 && 'flex-start'} justify={!yelpResults?.length > 0 ? 'center': 'flex-start'}>
                    {isSearching ?
                        <div>
                            <div> Please wait as we fetch your data</div>
                            <Gap gap={24}/>
                            <FlexBox justify={'center'} align={'center'}>
                                <BeatLoader color={theme.lightGreen} />
                            </FlexBox>

                        </div>

                        :yelpResults.length > 0 ?
                        <div>
                            <div>  {yelpResults?.length > 0 && <div> {`Showing ${yelpResults.length} results`}</div> }</div>
                        <YelpResultsList list={yelpResults}/>
                        </div>
                        :
                        <Empty
                        image="planet.png"
                        imageStyle={{
                            height: 300,
                        }}
                        description={
                            <div className={'empty-state-text'}>
                                Get started by making a search!
                            </div>
                        }/>

                    }

                </FlexBox>


                {/*<FlexBox justify={'flex-end'} className={'right-side-content'}>*/}
                {/*    <YelpResultsList isLoading={isLoading || isFetching} list={interests} type={'interest'} />*/}
                {/*</FlexBox>*/}
            </FlexBox>


        </Container>
    )
}

export default MyInterests;

const Container = styled.div`
  
  .main-content {
    margin: 12px;
    min-width: 60%;
    //max-width: 60%;
    min-height: 600px;
    max-height: 600px;
  }
  
  .empty-state-text { 
    font-size: 18px;
    font-weight: 500;
  }
  //.right-side-content {
  //  
  //}
`
