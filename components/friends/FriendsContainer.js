import styled from "styled-components";
import {useFriendCounts} from "@/hooks/users.hook";
import {useRouter} from "next/router";
import {Tabs} from "antd/lib";
import {theme} from "@/styles/themes";
import {useEffect, useState} from "react";
import {supabase} from "@/services/supabase";
import {useQueryClient} from "react-query";
import FriendRequestList from "@/components/friends/FriendRequestList";
import AcceptedFriends from "@/components/friends/AcceptedFriends";

const FriendsContainer = () => {
    const router = useRouter();

    const {userId} = router.query;
    const client= useQueryClient();

    const [friendType,setFriendType] = useState('ACCEPTED')
    const {data: counts} = useFriendCounts(userId)

    useEffect(() => {

        supabase
            .channel('friends')
            .on('postgres_changes', { event: '*', schema: 'public', table:'friends' }, async payload => {
                await client.refetchQueries(['friends', userId, 'counts']);
            })
            .subscribe();


    }, [supabase])


    return (
        <Container>
            <div className={'friends-title'}> Your Friends</div>
            <Tabs activeKey={friendType} onChange={(val) => setFriendType(val)}>
                <Tabs.TabPane tab={`Your Friends (${counts?.acceptedCount || '0'})`} key={'ACCEPTED'}>
                    {friendType === 'ACCEPTED' && <AcceptedFriends />}
                </Tabs.TabPane>
                <Tabs.TabPane tab={`Friend Requests (${counts?.pendingCount || '0'})`} key={'PENDING'}>
                    {friendType === 'PENDING' && <FriendRequestList />}
                </Tabs.TabPane>
            </Tabs>


        </Container>
    )
}

export default FriendsContainer;



const Container = styled.div`

    .friends-title {
      font-size: 18px;
    }

  .no-friends-text {
    color: ${theme.steel20};
  }

  .find-friends-btn {
    //width: 100px;
    //height: 50px;
    color: ${theme.steel10};
    cursor: pointer;
    // background-color: ${theme.lavender};
    //border: none;
  }
  .find-friends-btn:hover {
    //background-color: red;
    color: ${theme.ashGrey};
  }
`
