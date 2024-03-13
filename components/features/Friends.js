import styled from "styled-components";
import {theme} from "@/styles/themes";
import {useUserBuddies} from "@/hooks/users.hook";
import {useAuthContext} from "@/context/auth.context";
import {FlexBox} from "@/components/common";
import BuddyItem from "@/components/features/BuddyItem";

const FriendsPage = () => {

    const { user } = useAuthContext();
    const {data: buddies } = useUserBuddies(user?.id)

    return (
            <Container>

                <div>
                    My Buddies
                </div>


                <FriendsList>
                    {buddies?.map((buddy, index) => {
                        return (
                            <FlexBox key={`buddy-${index}`} gap={12}>
                                <BuddyItem buddy={buddy}/>
                                {/*<div>*/}
                                {/*    {buddy?.email}*/}
                                {/*</div>*/}
                            </FlexBox>
                        )
                        })}
                </FriendsList>



            </Container>
    )
}

export default FriendsPage;

const Container = styled.div`
  color: white;
`


const FriendsList = styled(FlexBox)`
  width: 100%;
`
