import styled from "styled-components";
import PlanItem from "@/components/profile/HangoutItem";
import {FlexBox} from "@/components/common";

const PlansSection = ({list = []}) => {
    return (
        <Container>

           <FlexBox gap={24} justify={'flex-start'}>
               {list?.map((plan, index) => {
                   return (
                       <PlanItem key={`plan-${index}`} plan={plan}/>
                   )
               })}
           </FlexBox>
        </Container>
    )
}

export default PlansSection;

const Container = styled.div``
