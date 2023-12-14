import styled from 'styled-components';
import Layout from "@/layouts";
import AuthLayout from "@/layouts/authLayout";
import {Button, Input, notification, Result} from "antd/lib";
import {FlexBox} from "@/components/common";
import {useState} from "react";
import {useRouter} from "next/router";
import {theme} from "@/styles/themes";
import {supabase} from "@/services/supabase";

const SignUp = () => {
    const [loginForm, setLoginForm] = useState({})
    const [awaitingEmailVerification, setEmailVerification] = useState(false)
    const [resent, setResent] = useState(false)
    const router = useRouter();
    const handleChange = (name) => (e) => {
        setLoginForm({
            ...loginForm,
            [name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginForm.email | !loginForm.password) {
            return notification.error({
                message: 'Missing Fields',
                description: 'Both email and password are required',
                duration: 3
            })
        }
       try{
           const {data, error} = await supabase.auth.signUp({
               email: loginForm.email,
               password: loginForm.password
           })
           setEmailVerification(true)
       } catch (e) {
           return notification.error({
               message: 'Error',
               description: 'Something went wrong ' + ( e ?? e.message),
               duration: 3
           })
       }
    }

    const handleResend = async () => {
        const getURL = () => {
            let url =
                process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
                process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
                'http://localhost:3000/'
            // Make sure to include `https://` when not localhost.
            url = url.includes('http') ? url : `https://${url}`
            // Make sure to include a trailing `/`.
            url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
            return url
        }
        const {data,error} = await supabase.auth.resend({
            type: 'signup',
            email: loginForm.email,
            options: {
                emailRedirectTo: getURL()
            }
        })

        if (!error) {
            setResent(true)
            return notification.success({
                message:'Email resent',
                description: `A new email has been sent to ${loginForm.email}`,
                duration: 5
            })
        } else {
            setResent(true)
            return notification.error({
                message: 'Error',
                description: 'Try again later',
                duration: 3
            })
        }
    }
    return (
        <Layout>
            <AuthLayout>
                <Container align={'center'} direction={'column'}>
                    {!awaitingEmailVerification ? (
                        <>
                            <div className={'login-text'}> Sign Up </div>
                            <FlexBox className={'input-container'} direction={'column'} gap={12} style={{width: '100%'}}>
                                <div >  Email</div>
                                <Input className={'inputs'} value={loginForm?.email} onChange={handleChange('email')}/>
                                <div >  Password </div>

                                <Input className={'inputs'} value={loginForm?.password} onChange={handleChange('password')}/>
                                <Button onClick={handleSubmit}> Sign Up</Button>

                                <FlexBox direction={'column'} gap={4}>

                                    <div  className={'anchors'} onClick={() => router.push('/login')}>
                                        {`Have an account? Sign in here`}
                                    </div>
                                </FlexBox>

                            </FlexBox>
                        </>
                    ) : (
                        <>
                            <Result
                                status="success"
                                title={                            <div className={'email-verification-text title'}> Email verification sent</div>
                                }
                                subTitle={                            <div  className={'email-verification-text subtitle'}> Check your email at <span className={'user-email'}> {loginForm.email} </span> for an email from us. Check your spam folder.</div>
                                }
                                extra={[
                                    !resent && <div className={'resend-text'} onClick={handleResend}> {`Don't see one? Resend email`}</div>

                                    ]}
                            />
                            {/*<div className={'email-verification-text title'}> Email verification sent</div>*/}
                            {/*<div  className={'email-verification-text subtitle'}> Check your email at <span className={'user-email'}> {loginForm.email} </span> for an email from us. Check your spam folder.</div>*/}
                            {/*{!resent && <div className={'resend-text'} onClick={handleResend}> {`Don't see one? Resend email`}</div>}*/}
                        </>
                    )}

                </Container>
            </AuthLayout>

        </Layout>
    );
}

export default SignUp;

const Container = styled(FlexBox)`
  margin: 24px;
  
  
  .title {
    font-size:18px;
    color: ${theme.steel10};
  }
  .subtitle  {
    margin-top: 12px;
    font-size: 14px;
    color: ${theme.steel10};
    
  }
  .resend-text {
    margin-top: 18px;
    color: ${theme.steel20};
    cursor: pointer;
  }
  
  .inputs {
    width: 50%;
  }
  
  .login-text {
    margin-bottom: 24px;
    color: ${theme.ashGrey};
    font-size: 28px;
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
