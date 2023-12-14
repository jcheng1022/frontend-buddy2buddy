import {useState} from "react";
import styled from "styled-components";
import {Input, Modal, notification} from "antd/lib";
import {useAppContext} from "@/context/app.context";
import APIClient from '../../services/api'
import {FlexBox} from "@/components/common";
import {theme} from "@/styles/themes";
import {Loader, Plus} from "react-feather";

const {Search} = Input;
const FriendModal = () => {

    const {openFriendModal, setOpenFriendModal} = useAppContext();
    const [friendUsername, setFriendUsername] = useState('')
    const [friendResults, setFriendResults] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [isSearching, setIsSearching] = useState(false)


    const findFriendsByUsername = async () => {

        setIsSearching(true)
        await APIClient.api.get('/user/search', {params: {
            username: friendUsername
            }}).then((data) => {
            setIsSearching(false)
            setFriendResults(data)
        }).catch((e) =>{
            setIsSearching(false)
            notification.error({
                message: 'oops',
                description : e ?? e.message,
                duration:3
            })
        })

    }

    const sendFriendRequest = (friendId) => async () => {
        setIsSending(true)
        await APIClient.api.post(`/user/friends/${friendId}`).then(() => {
            setIsSending(false)
            setOpenFriendModal(false)
        }).catch((e) => {
            setIsSending(false)
        })
    }

    const handleChange = (e) => {
        setFriendUsername(e.target.value)
    }
    return (
        <Container open={openFriendModal} onClose={() => setOpenFriendModal(false)}>

            <div> Find Friends</div>
            <Search
                loading={isSearching}
                placeholder="Friend's username"
                allowClear
                value={friendUsername}
                onChange={handleChange}
                onSearch={findFriendsByUsername}

            />

            <ResultsContainer>
                {friendResults?.map((user, index) => {
                    return (
                        <FriendContainer key={`friend-${user.id}`}>
                            <FlexBox className={'user-section'} gap={24} wrap={'no-wrap'}>

                                <div className={'user-logo-container'}>
                                    <div className={'user-logo'}> { !!user?.username && user?.username[0].toUpperCase()}</div>
                                </div>
                                <div className={'user-username'}> {user?.username}</div>
                                <FlexBox justify={'flex-end'} style={{marginRight: 12}} onClick={sendFriendRequest(user?.id) }>
                                    {isSending ? <Loader /> : <Plus />}
                                </FlexBox>
                            </FlexBox>

                        </FriendContainer>
                    )
                })}
            </ResultsContainer>

        </Container>
    )
}




export default FriendModal;

const Container = styled(Modal)``

const ResultsContainer = styled.div`
  min-height: 200px;
  margin: 24px 0px;
 
`

const FriendContainer = styled(FlexBox)`
  border: 1px solid ${theme.ashGrey};
  border-radius: 12px;
  padding: 12px 8px;

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
