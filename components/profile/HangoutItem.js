import styled from "styled-components";
import {List, Users} from "react-feather";
import {Tooltip} from "antd/lib";
import dayjs from "dayjs";
import {theme} from "@/styles/themes";
import {useRouter} from "next/router";

const PlanItem = ({plan }) => {
    const router = useRouter();
    return (
        <Container onClick={() => router.push(`/plan/${plan?.id}`)}>
            <div className={'img-container'}>
                <img src={'/brand-logo.png'} className={'brand-logo'} />
            </div>

            <div className={'plan-details'}>
                <div className={'name'}>
                    {plan.name}
                </div>
                    <div className={'date'}>
                        {plan.date ? dayjs(plan.date).format('MMM Do, YYYY') : 'No date set'}
                    </div>


                <div className={'counts'}>
                    <Tooltip title={'Event Count'}>
                        <div>
                            <List size={14} />
                            <span className={'count-item'}>
                            {plan.eventCount}
                        </span>
                        </div>
                    </Tooltip>
                    <Tooltip title={'Attendee Count'}>
                        <div>
                            <Users size={14} />
                            <span className={'count-item'}>
                            {plan.attendeeCount}
                        </span>
                        </div>
                    </Tooltip>
                </div>
            </div>

        </Container>
    )
}

export default PlanItem;

const Container = styled.div`
  border: 1px solid white;
color: white;
  margin: 8px 0px;
  min-width: 200px;
  max-width: 200px;
  min-height: 100px;
  
  &:hover {
    cursor: pointer;
    transform: scale(1.02);
    border-radius: 4px;
  }

  .img-container {
    width: 100%;
    height: 75px;
  }

  .brand-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .plan-details {
    
    padding: 4px 8px;
    min-height: 50px;
  }
  
  .date {
    font-size: 14px;
    color: ${theme.steel20};
  }
  
  .counts {
    display: flex;
    margin-top: 12px;
  }
  
  .count-item {
    margin: 0px 8px;
  }
`
