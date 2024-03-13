import Header from "@/components/Header";
import styled from "styled-components";
import LeftSideNav from "@/components/LeftSideNav";
import {FlexBox} from "@/components/common";

import RightSideInterestContainer from "@/components/rightMenu/RightSideInterestContainer";
import {Layout as AntLayout} from 'antd/lib'


const { Footer } = AntLayout

const Layout = ({children, isInterest = false}) => {

    return (
        <>
               <Header/>

            <GlobalAntdLayout>
                <LeftSideNav/>
                {children}

                {!!isInterest && (
                <FlexBox justify={'flex-end'} className={'right-side-content'}>
                    <RightSideInterestContainer />
                </FlexBox>

                )}


            </GlobalAntdLayout>
            <Footer style={{
                // textAlign: 'center',
                color: '#fff',
                backgroundColor: '#2b2b2b',
            }}>
                Built by Jacky

            </Footer>


        </>
    )
}

export default Layout;




const GlobalAntdLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 100%;
  overflow: hidden;
  width: 100%;
  //padding: 12px;
  flex: 1;

  height: 100vh;  
  .right-side-content{
    padding: 24px;
  }
  
  .ant-layout-sider-children {
    height: 100%;
  }

  .ant-menu {
    height: 100%;
  }
  

  .ant-layout-sider {
    
    overflow: hidden;
    height: 100%;
    flex: 0;
    z-index: 9999;
    
  }

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }

  .ant-layout-sider-has-trigger {
    padding-bottom: 0;
  }

  .ant-layout-sider-trigger {
    display: none;
    position: static !important;
  }

  .ant-layout-sider-zero-width-trigger {
    display: none;
  }
`

