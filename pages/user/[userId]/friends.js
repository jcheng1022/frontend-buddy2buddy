import styled from "styled-components";
import {theme} from "@/styles/themes";
import {useUserBuddies} from "@/hooks/users.hook";
import {useAuthContext} from "@/context/auth.context";
import {FlexBox} from "@/components/common";
import BuddyItem from "@/components/features/BuddyItem";
import Layout from "@/layouts";
import {Button} from "antd/lib";
import {User, UserPlus} from "react-feather";
import {useAppContext} from "@/context/app.context";
import AddBuddyModal from "@/components/modals/AddBuddy";

const FriendsPage = () => {

    const { user } = useAuthContext();
    const {openAddBuddyModal} = useAppContext()
    const {data: buddies } = useUserBuddies(user?.id)
    console.log(buddies, 22)

    return (
       <Layout>
           <Container>

              <FlexBox  justify={'space-between'}>
                  <div className={'page-title'}>
                      My Buddies
                  </div>
                <div>
                    <Button onClick={openAddBuddyModal} >
                        Add Buddy
                    </Button>
                </div>
              </FlexBox>


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


               {openAddBuddyModal && <AddBuddyModal/>}


           </Container>
       </Layout>
    )
}

export default FriendsPage;

const Container = styled.div`
  color: white;
  width: 100%;
  padding: 24px;
  
  .page-title {
    margin-bottom: 24px;
    font-size: 24px;
  }
`


const FriendsList = styled(FlexBox)`
  width: 100%;
`
