import styled from "styled-components";
import {theme} from "@/styles/themes";
import {FlexBox} from "@/components/common";
import {useRouter} from "next/router";
import {useAuthContext} from "@/context/auth.context";
import {useEffect} from "react";


const AuthLayout = ({children}) => {

    const router = useRouter();

    const {user} = useAuthContext()

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [])
    return (
        <LayoutContainer justify={'space-around'} wrap={'no-wrap'}>

            <div className={'left-side-content'}>
                test contetete
            </div>

                <div className={'right-side-content'}>
                    {children}
                </div>


        </LayoutContainer>
    )
}

export default AuthLayout;


const LayoutContainer = styled(FlexBox)`
  height: 100%;
    .left-side-content {
      height: 100vh;
      min-height: 100vh;
      width: 50%;
      min-width: 50%;
      max-width: 50%;
      background-color: ${theme.lightLavender};
    }
  
  .right-side-content {
    width: 600px;
  }

  @media screen and (max-width: 700px) {
    .left-side-content {
      display:none;
    }
    .right-side-content {
      width:  400px;
    }
  }

  @media screen and (max-width: 1200px) {
    .left-side-content {
      width: 30%;
    }
    .right-side-content {
      width:  400px;
      margin-left: 35px;
    }
  }
    
`
