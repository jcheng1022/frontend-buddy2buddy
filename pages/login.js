import styled from 'styled-components';
import Layout from "@/layouts";
import AuthLayout from "@/layouts/authLayout";
import {Button, Input, notification} from "antd/lib";
import {FlexBox} from "@/components/common";
import {useState} from "react";
import {useRouter} from "next/router";
import {theme} from "@/styles/themes";
import {supabase} from "@/services/supabase";

const Login = () => {
    const [loginForm, setLoginForm] = useState({})
    const router = useRouter();
    const [err, setErr] = useState({})
    const handleChange = (name) => (e) => {
        setLoginForm({
            ...loginForm,
            [name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {
        setErr({})


        if (!loginForm.email | !loginForm.password) {
            return notification.error({
                message: 'Missing Fields',
                description: 'Both email and password are required',
                duration: 3
            })
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
            setErr({
                ...err,
                email: 'Not a valid email'
            })
            return;
        }

        const {data, error} = await supabase.auth.signInWithPassword({
            email: loginForm.email,
            password: loginForm.password
        })

        if (error) {
            setErr({
                ...err,
                account: 'Invalid credentials'
            })
        } else {
            await router.push('/')
        }


    }

    return (
        <Layout>
          <AuthLayout>
             <Container align={'center'} direction={'column'}>
                 <div className={'login-text'}> Log in</div>
                 <FlexBox className={'input-container'} direction={'column'} gap={12} style={{width: '100%'}}>
                     <div >  Email</div>
                     <Input className={'inputs'} value={loginForm?.email} onChange={handleChange('email')}/>
                     {err?.email && <div style={{fontSize:12, color: "red"}}> {err?.email} </div> }

                     <div >  Password </div>
                     <Input className={'inputs'} type={'password'} value={loginForm?.password} onChange={handleChange('password')}/>

                     {err?.account && <div style={{fontSize:12, color: "red"}}> {err?.account} </div> }
                     <Button onClick={handleSubmit}> Log In</Button>

                     <FlexBox direction={'column'} gap={4}>
                         <div className={'anchors'}>
                         Forgot Password?
                         </div>
                         <div  className={'anchors'} onClick={() => router.push('/sign-up')}>
                             {`Don't have an account yet? Sign up Here`}
                         </div>
                     </FlexBox>

                 </FlexBox>

             </Container>
           </AuthLayout>

        </Layout>
    );
}

export default Login;

const Container = styled(FlexBox)`
  margin: 24px;
  
  .inputs {
    width: 50%;
  }
  
  .login-text {
    margin-bottom: 24px;
    font-size: 28px;
    color: ${theme.ashGrey};
  }
  
  .anchors {
    color: ${theme.steel60};
    font-size: 12px;
  }
  
  .anchors:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  
  .input-container {
    padding: 48px 0px;
    background-color: ${theme.lavender};
    border-radius: 12px;
  }
  
`
