import styled from "styled-components";
import {useUserFriends} from "@/hooks/users.hook";
import {FlexBox} from "@/components/common";
import {Frown} from "react-feather";
import {theme} from "@/styles/themes";
import {Result} from "antd/lib";
import {useEffect} from "react";
import {supabase} from "@/services/supabase";
import {useQueryClient} from "react-query";
import {useAppContext} from "@/context/app.context";
import {useRouter} from "next/router";

const FriendRequestList = () => {
    const client = useQueryClient();
    // const {user} = useAuthContext();
    const router = useRouter()
    const {userId} = router.query;
    const {data: friends} = useUserFriends(userId, 'ACCEPTED' )
    const {openFriendModal, setOpenFriendModal} = useAppContext()


    useEffect(() => {

        supabase
            .channel(`accepted-friends`)
            // .on('postgres_changes', { event: '*', schema: 'public', tables: ['batches', 'tasks'] }, payload => {

                .on('postgres_changes', { event: '*', schema: 'public', table:'friends' }, async payload => {

                await client.refetchQueries(['friends', userId, 'ACCEPTED']);
            })
            .subscribe();


    }, [supabase])

    // const handleRequest = (friendId, result = 'ACCEPTED')  => async () => {
    //     await APIClient.api.patch(`user/friends/${friendId}/status/${result}`)
    // }




    return (
        <Container>
            { friends?.length === 0 ? (
                <div>
                    <Result
                        icon={<Frown color={theme.ashGrey}  size={48}/>}
                        title={<div className={'no-friends-text'} >No requests yet! </div>}
                        extra={<FlexBox justify={'center'}><div className={'find-friends-btn'} onClick={() => setOpenFriendModal(true)}>Find Friends</div></FlexBox>}
                    />
                </div>
            ) : (friends?.map((request, index) => {
                const friendUser = request?.recipient?.id === userId ? request?.sender : request?.recipient
                return (
                    <RequestItem key={`accepted-friend-${request.id}`}>
                        <FlexBox className={'user-section'} gap={24} wrap={'no-wrap'}>

                            <div className={'user-logo-container'}>
                                <div className={'user-logo'}> { !!friendUser?.username && friendUser?.username[0].toUpperCase()}</div>
                            </div>
                            <div className={'user-username'}> {friendUser?.username}</div>
                            <FlexBox justify={'flex-end'} gap={12}style={{marginRight: 12}} onClick={ () => console.log(`hi`) }>

                                {/*<div>*/}
                                {/*    <Check color={theme.lightGreen}/>*/}
                                {/*</div>*/}

                                {/*<X color={theme.red} onClick={handleRequest(request?.id, 'DECLINED')} />*/}


                                {/*{isSending ? <Loader /> : <Plus />}*/}
                            </FlexBox>
                        </FlexBox>
                    </RequestItem>
                )
            }))}
        </Container>
    )
}

export default FriendRequestList;

const Container = styled.div``

const RequestItem = styled(FlexBox)`
  margin-bottom: 18px;

.user-username {
  letter-spacing: 1px;
  font-size: 18px;
  color: ${theme.ashGrey};
}
  .user-section {
    width: 100%;
  }


  .user-logo-container {
    display: inline-block;
    text-align: center;
    min-width: 30px;
    min-height: 30px;
    background-color: ${theme.ashGrey};
    border-radius: 50%;
    position: relative;
  }

  .user-logo {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 30px;
    height: 22px;
  }

`
