import {Button, Input, Modal, notification} from "antd/lib";
import styled from "styled-components";
import {FlexBox, Gap} from "@/components/common";

import React, {useState} from "react";
import APIClient from '../services/api'
import {useQueryClient} from "react-query";
import {useRouter} from "next/router";
import {useAuthContext} from "@/context/auth.context";
import {theme} from "@/styles/themes";


const FinishProfile  = () => {
    const client = useQueryClient();
    const router = useRouter();
    const [error, setError] = useState('')
    const {finishProfile, setFinishProfile, user, setUser} = useAuthContext();

    const [profile, setProfile] = useState({});
    const handleChange = (name) => (e) => {
        setProfile({
            ...profile,
            [name]: e.target.value
        })
    }
    const validate = () => {
        const lettersOnly= /^[a-zA-Z]+$/
        const noSpecialCharacters = /^[a-zA-Z0-9]+$/
        if (!profile?.firstName || !profile?.lastName || !profile?.username) {
            setError('Missing fields')
            return false
        }


        if (!lettersOnly.test(profile?.firstName) || !lettersOnly.test(profile?.firstName)) {
            setError('First name and Last name must only have letters')
            return false;
        }

        if (!noSpecialCharacters.test(profile?.username)) {
            setError('No special characters as a username')

            return false;
        }


        return true;


    }
    const onSubmit = async () => {
        const isValid = validate();

        if (!isValid) {
            return;
        }

        return APIClient.api.put('/user/profile', profile).then(async (data) => {
            await client.refetchQueries(['user', 'me', user.id])
            setUser(data)
            setFinishProfile(finishProfile => !finishProfile)
            await notification.success({
                message: 'Success',
                description: 'User profile updated',
                duration: 5
            })
        })
    }

    return (
        <Container
            open={finishProfile}
            onCancel={() => setFinishProfile(false)}
            closable={false}
            maskClosable={false}
            footer={[
                <FlexBox justify={'center'} key={'finish-modal-btn'}>
                    <Button onClick={onSubmit}> Finish</Button>
                </FlexBox>
            ]}
        >
            <div className={'finish-title'}> Finish Setting Up Your Account! </div>
            <div className={'finish-description'}> {`Now that your account is created, be sure to make it complete by creating a username and your name!`}</div>
            <Gap gap={24}/>
            <FlexBox gap={12}>
                <Input placeholder={'First Name'} onChange={handleChange('firstName')}/>
                <Input placeholder={'Last Name'} onChange={handleChange('lastName')}/>
                <Input placeholder={'Username'} onChange={handleChange('username')}/>
            </FlexBox>

            {error && <div style={{fontSize:12, color: "red"}}> {error}</div>}
        </Container>
    )
}

export default FinishProfile;

const Container = styled(Modal)`

    .finish-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }

  .finish-description {
    font-size: 12px;
    color: ${theme.steel40};

  }
`
