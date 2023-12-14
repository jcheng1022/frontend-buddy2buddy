import Header from "@/components/Header";
import styled from "styled-components";


const Layout = ({children}) => {


    return (
        <LayoutContainer>
            <Header/>
            {children}

        </LayoutContainer>
    )
}

export default Layout;


const LayoutContainer = styled.div`
height: 100vh;
    
`
