import Layout from "@/layouts";
import styled from "styled-components";
import {useRouter} from "next/router";
import {usePlanById} from "@/hooks/users.hook";
import dayjs from "dayjs";
import {Star} from "react-feather";
import {Avatar, Tooltip} from "antd/lib";
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import {FlexBox} from "@/components/common";


const PlanPage = () => {
    const router = useRouter();

    const {planId} = router.query;

    const {data: plan} = usePlanById(planId)


    const getAttendees = () => {
        let attendees = [];
        const showAmt = plan?.attendees?.length > 2 ? 2 : plan?.attendees?.length

        for (let i = 0; i < showAmt; i++) {
            attendees.push(
                <Tooltip title={plan?.attendees[i]?.user?.name}>
                    <Avatar
                        style={{
                            backgroundColor: '#1677ff',
                        }}
                    >
                        {plan?.attendees[i].user?.name[0]}
                    </Avatar>
                </Tooltip>
            )
        }

            // attendees.push(<Star key={i} size={12} />);



        return attendees;
    };

    return (
        <Layout>
            <Container>

                <div className={'basic-info'}>
                   <FlexBox >
                       <div className={'detail name'}>
                           {plan?.name}
                       </div>
                       <FlexBox align={'center'} justify={'flex-end'} className={'detail attendee-count'}>
                        <span>
                             <Avatar.Group >

                           {getAttendees()}
                                     </Avatar.Group>

                        </span>
                           <span className={'count'}>
                            {plan?.attendees?.length} attendees
                        </span>
                       </FlexBox>

                   </FlexBox>
                    <div className={'detail date'}>
                        {plan?.date ? dayjs(plan?.date).format('MMM Do, YYYY') : 'No date set'}
                    </div>
                    <div className={'creator-name'}> Created by {plan?.creator?.name}</div>

                </div>
            </Container>
        </Layout>
    )
}


export default PlanPage;

const Container = styled.div`
  padding: 12px;
  color: white;
  width: 100%;
  
  .basic-info {
    width: 100%;
  }
 
  .name {
    font-size: 24px;
    letter-spacing: 1.1px;
    margin-bottom: 4px;
  }
  .date {
    font-size: 14px;
    //margin-bottom: 12px;
  }
  
  .count {
    margin-left: 6px;
  }
  
  .creator-name {
    font-size: 12px;
  }
  
  
`
