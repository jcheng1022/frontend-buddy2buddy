import styled from "styled-components";
import {useAuthContext} from "@/context/auth.context";
import {useUserInterests} from "@/hooks/interests.hooks";
import YelpResultsList from "@/components/YelpResultsList";
import {Gap} from "@/components/common";
import FriendActivityContainer from "@/components/rightMenu/friends/FriendActivityContainer";

const RightSideInterestContainer = () =>  {

    const {user} = useAuthContext();

    const {data: interests, isLoading, isFetching} = useUserInterests(user?.id)

    return (
        <Container>

            <FriendActivityContainer />

            <Gap gap={24}/>


            <YelpResultsList isLoading={isLoading || isFetching} list={interests} type={'interest'} />




        </Container>
    )
}


export default RightSideInterestContainer;

const Container = styled.div``
