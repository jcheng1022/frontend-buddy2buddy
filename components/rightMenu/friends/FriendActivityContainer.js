import styled from "styled-components";
import {Gap, MenuSectionTitle} from "@/components/common";
import FriendsList from "@/components/rightMenu/friends/FriendsList";

const FriendActivityContainer = () => {

    return (
        <Container>
            <MenuSectionTitle>
                My Friends
            </MenuSectionTitle>

            <Gap gap={12}/>

            <FriendsList />
        </Container>
    )
}


export default FriendActivityContainer;

const Container = styled.div`
  padding: 12px;
  background-color: red;
  min-height: 200px;
  max-height: 200px;
  overflow-y: auto;
`
