import styled from 'styled-components';
import {Modal} from "antd/lib";
import {useAppContext} from "@/context/app.context";
import {FlexBox, Gap} from "@/components/common";
import {PlusSquare} from "react-feather";
import {theme} from "@/styles/themes";
import {useAuthContext} from "@/context/auth.context";
import {useRouter} from "next/router";

const WelcomeModal = () => {
    const {welcomeModal, setWelcomeModal, handleClickNewTask} = useAppContext();
    const {user} = useAuthContext();
    const router = useRouter();

    const actions = [
        {
            text: 'New Entry',
            icon: <PlusSquare />,
            onClick: handleClickNewTask
        },
        // {
        //     text: 'View Profile',
        //     icon: <User />,
        //     onClick: () => router.push(`/user/${user.id}`)
        // },
        // {
        //     text: 'New Entry',
        //     icon: <PlusSquare />
        // },
        // {
        //     text: 'New Entry',
        //     icon: <PlusSquare />
        // },
        // {
        //     text: 'New Entry',
        //     icon: <PlusSquare />
        // },
    ]

    return (
        <Container key={`welcome-modal`} open={welcomeModal} onCancel={() => setWelcomeModal(false)} footer={[]}>
            {/* Your component content here */}
            <FlexBox align={'center'} direction={'column'}>
               <div  className={'welcome-text'}>
                   {`Welcome back ${user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1)}!`}
               </div>
                <div  className={'welcome-description'}>
                    {`What do you want to do today?`}
                </div>
            </FlexBox>


            <Gap gap={24}/>
            <FlexBox justify={'space-around'} gap={8}>
                {actions.map((action, index) => {
                    return (
                        <ActionContainer key={`action-${index}`} direction={'column'} onClick={action?.onClick}>
                            <div>
                                {action.icon}
                            </div>
                            <div>
                                {action.text}
                            </div>
                        </ActionContainer>
                    )
                })}
            </FlexBox>


        </Container>
    );
}

export default WelcomeModal;

const Container = styled(Modal)`

    .welcome-text {
      font-size: 18px;
      font-weight: 500;
      
    }
  .welcome-description {
    font-size: 12px;
    color: ${theme.steel60};
  }
`

const ActionContainer = styled(FlexBox)`
  padding: 12px;
    border: 2px solid ${theme.lavender};
  
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background-color: ${theme.lavender};
  }
`
