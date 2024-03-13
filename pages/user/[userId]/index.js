import styled from "styled-components";
import Layout from "@/layouts";
import {useAuthContext} from "@/context/auth.context";

import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {useUserProfile} from "@/hooks/users.hook";
import PlansSection from "@/components/profile/HangoutSection";
import {FlexBox} from "@/components/common";
import {Button} from "antd/lib";
import {useAppContext} from "@/context/app.context";
import CreatePlanModal from "@/components/modals/CreatePlanModal";

const localizer = dayjsLocalizer(dayjs)


const UserProfilePage = () => {
    const {user, setUser} = useAuthContext();
    const {data: profile} = useUserProfile(user?.id)
    const {openCreatePlan, closeCreatePlan, openCreatePlanModal} = useAppContext()
    return (
        <Layout>
            <Container align={'flex-start'}>

                <SectionContainer>
                    <div className={'section-title'}>
                        Calendar
                    </div>
                    <div>
                        <Calendar
                            localizer={localizer}
                            events={[]}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 400, width: 400, color: 'white' }}
                        />
                    </div>
                </SectionContainer>
                <SectionContainer height={400}>
                    <FlexBox justify={'space-between'}>
                        <div className={'section-title'}>
                            Plans
                        </div>
                        <Button onClick={openCreatePlanModal}>
                            New
                        </Button>
                    </FlexBox>
                    <PlansSection list={profile?.plans} />

                </SectionContainer>

                {!!openCreatePlan && <CreatePlanModal />}
            </Container>
        </Layout>
    )
}


export default UserProfilePage;

const Container = styled(FlexBox)``


const SectionContainer = styled.div`
  min-width: ${props => props.width ? `${props.width}px` : '200px'}; /* Default height is set to 300px, change it to your preferred default height */
  max-width: 500px;
  min-height: ${props => props.height ? `${props.height}px` : '300px'}; /* Default height is set to 300px, change it to your preferred default height */
  margin: 12px;
  padding: 12px;
  border: 1px solid white;
  
  .section-title {
    color: white;
    margin-bottom: 18px;
    font-size: 18px;
  }
`
