import styled from 'styled-components'
import {FlexBox, Gap} from '../components/common/index'
import {Button, Dropdown, Menu, notification, List, Input} from "antd/lib";
import {supabase} from "@/services/supabase";
import {useAuthContext} from "@/context/auth.context";
import {useRouter} from "next/router";
import {theme} from "@/styles/themes";
import {Globe} from "react-feather";
import {useUserFriends, useUserNotifications} from "@/hooks/users.hook";
import {QueryClient, QueryObserver, useQueryClient} from "react-query";
import {useEffect, useMemo, useState} from "react";
import APIClient from '../services/api'
import dayjs from "dayjs";
import SearchComponent from "@/components/SearchComponent";
import {useSearchParams} from "next/navigation";

const Header = () => {
    const router = useRouter();
    const {user, setUser} = useAuthContext();
    const client = useQueryClient();
    const [showNotifications, setShowNotifications] = useState(false)

    const { data: notifications, refetch: refetchNotifications } = useUserNotifications(user?.id)
    const {data: pendingFriends} = useUserFriends(user?.id, 'PENDING')


    const handleClick = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    }



    return (

        <Container justify={'space-between'}>
            <FlexBox gap={12} className={'left-side'} onClick={() => router.push('/')}>

                <div className={'img-container'}>
                    <img src={'/brand-logo.png'} className={'brand-logo'} />
                </div>

                Buddy2Buddy
            </FlexBox>

            <FlexBox justify={'center'} wrap={'no-wrap'}>
               <SearchComponent />
            </FlexBox>

           <FlexBox gap={24} justify={'flex-end'}>

                       <Globe color={'white'} size={20} onClick={() => setShowNotifications(prev => !prev)} />

               <div className={'notification-list'} style={{
                   display: showNotifications ? 'block' : 'none',
                   width: 400,
                   position: 'absolute',
                   top: 50,
                   right: 40,
                   zIndex: 100,
                   backgroundColor: 'white',
                   padding: 12,
                   borderRadius: 12,  }
               }>

                   {
                       pendingFriends?.length > 0 && (
                           <>
                               <div className={'notif-headers'}> Buddy Requests</div>
                               <List

                                   itemLayout="horizontal"
                                   dataSource={pendingFriends}
                                   renderItem={(item, index) => {

                                       const handleRespond = (response) => () => {
                                           return APIClient.api.patch(`/user/buddies/${item?.id}`, {
                                               status: response
                                           }).then(async () => {
                                               await client.refetchQueries(['friends', user?.id])
                                           })
                                       }
                                       return (
                                           <List.Item>
                                               <FlexBox>
                                                   <div className={'buddy-name'}> {item?.friendName}</div>
                                                   <div className={'buddy-email'}> {item?.friendEmail}</div>
                                               </FlexBox>

                                               <FlexBox justify={'flex-end'} wrap={'no-wrap'} gap={6}>
                                                   <Button className={'invite-accept-btn'}
                                                           onClick={handleRespond('ACCEPTED')}
                                                           type={'primary'}>
                                                       Accept
                                                   </Button>
                                                   <Button
                                                       onClick={handleRespond('DECLINED')}
                                                   >
                                                       Decline
                                                   </Button>
                                               </FlexBox>

                                           </List.Item>
                                       )
                                   }}
                               />
                           </>
                       )
                   }
                   {/*<div className={'notif-headers'}> Notifications</div>*/}
                   {/* <Gap gap={12}/>*/}
                   <FlexBox justify={'space-between'}>
                       <div className={'notif-headers'}> Notifications</div>
                       <Button>
                           Mark all as read
                       </Button>
                   </FlexBox>
                   <List


                       // className="notification-list"
                       itemLayout="horizontal"
                       dataSource={notifications?.results}
                       renderItem={(item, index) => {
                           const handlePlanResponse = (response) => () => {
                               return APIClient.api.patch(`/planner/plan/${item?.meta?.planId}/user`, {
                                   status: response,
                                   notificationId: item?.id

                               }).then(async () => {
                                   await client.refetchQueries(['notifications', user?.id])
                               })
                           }
                           return (
                               <List.Item>
                                   <div className={'read-section'}>
                                       {!item?.isRead ? <div className={'read-icon'} /> : null}
                                   </div>
                                   <FlexBox direction={'column'} align={'start'}>
                                       <div className={'notification-message'}> {item?.message}</div>
                                       <div className={'timestamp'}> {dayjs(item?.createdAt).format('MMMM Do YYYY h:ss a')} </div>
                                       {/*<List.Item.Meta*/}
                                       {/*    // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}*/}
                                       {/*    // title={<a href="https://ant.design">{item.title}</a>}*/}
                                       {/*    description={item.message}*/}

                                       {/*/>*/}
                                       {item?.type === 'friend-request' ? (
                                           <FlexBox justify={'flex-end'} wrap={'no-wrap'} gap={6}>
                                               <Button className={'invite-accept-btn'} type={'primary'}>
                                                   Accept
                                               </Button>
                                               <Button>
                                                   Decline
                                               </Button>
                                           </FlexBox>
                                       ) : (item?.type === 'plan-invite' && item?.status === 'PENDING') ? (
                                           <>
                                               <Gap gap={8}/>
                                               <FlexBox direction={'row'} gap={18}>
                                                   <Button onClick={handlePlanResponse('ACCEPTED')} type={'primary'}>
                                                       Accept
                                                   </Button>
                                                   <Button onClick={handlePlanResponse('DECLINED')}>
                                                       Decline
                                                   </Button>
                                               </FlexBox>
                                           </>
                                       ) : null}
                                   </FlexBox>
                               </List.Item>
                           )
                       }}
                   />
               </div>
               {user ?
                   <div onClick={ () => router.push(`/user/${user.id}`)}>
                       {user?.name}
                   </div> :
                   // <Button onClick={signOut} > Sign Out</Button>:
                   <Button onClick={handleClick}>
                       Get Started
                   </Button>
               }
           </FlexBox>

        </Container>

    )
}

export default Header;

const Container = styled(FlexBox)`

  max-width: 100%;
  
    padding: 12px;
  background-color: #2b2b2b;
  color: white;
  
  .search-input {
    margin: 0px 4px;
    width: 300px;
  }
  
  .search-btn {
    margin: 0px 8px;
  }
  
  .read-section {
    margin-right: 12px;
  }
  .read-icon {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    
    background-color: ${theme.azure};
  }
  
  
  .buddy-name {
    font-weight: 500;
  }
  .buddy-email {
    font-size: 12px;
  }
  
  .timestamp {
    color: ${theme.steel20};
    font-size: 10px;
  }
 
  .notification-message { 
    font-size: 12px;
  }
  
  .notif-headers {
    color: ${theme.steel60};
  }
  
  .left-side {
    cursor: pointer;
  }
  
  // .left-side:hover {
  //   color: ${theme.lavender};
  // }
  


  .img-container {
    width: 40px;
    height: 40px;
  }
  
  .brand-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }
  
  .sign-out-btn {
    cursor: pointer;
    
  }
`
