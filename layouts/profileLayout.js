import styled from "styled-components";
import {FlexBox} from "@/components/common";
import {theme} from "@/styles/themes";
import ProfileSideMenu from "@/components/common/ProfileSideMenu";

const ProfileLayout = ({children}) => {
    return (
        <LayoutContainer wrap={'no-wrap'} align={'flex-start'}>
            <ProfileSideMenu/>
            {children}
        </LayoutContainer>
    )
}


export default ProfileLayout;

const LayoutContainer = styled(FlexBox)`
    
    .left-side {
      height: 100vh;
      width: 200px;
      border-top: 2px solid ${theme.roseQuartz};
      background-color: ${theme.jet};
    }
`
