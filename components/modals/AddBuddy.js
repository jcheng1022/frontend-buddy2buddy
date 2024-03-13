import styled from "styled-components";
import {Button, DatePicker, Input, Modal, Spin} from "antd/lib";
import {useAppContext} from "@/context/app.context";
import {Controller, useForm} from "react-hook-form";
import {useState} from "react";
import APIClient from "@/services/api";
import {useQueryClient} from "react-query";
import {useAuthContext} from "@/context/auth.context";
import {Gap} from "@/components/common";

const AddBuddyModal = () => {
    const {openAddBuddy, closeBuddyModal} = useAppContext()
    const {user} = useAuthContext();
    const { handleSubmit, control, setValue, getValues, register, reset } = useForm({
        defaultValues: {
            email: ''
        },
    });
    const client = useQueryClient();
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = () => {
        const formData = getValues();

        setIsLoading(true)
        return APIClient.api.post(`/user/buddies`, formData).then((data) => {
            // setResults(data)
        } ).finally(async () => {
            setIsLoading(false)
            await client.refetchQueries(['buddies', user?.id])
            closeBuddyModal()

        })

    }


    return (
        <Spin spinning={isLoading}>
            <ModalContainer open={openAddBuddy} onCancel={closeBuddyModal} footer={[
                <Button onClick={() => {}}>
                    Cancel
                </Button>,
                <Button loading={isLoading} onClick={onSubmit} type={'primary'}>
                    Create
                </Button>
            ]}>

                <div> Buddy Search </div>

                <Gap gap={14}/>

                <Controller
                    render={({ field }) => <Input
                        {...register('email')}
                        placeholder={'e.g: user@gmail.com'} {...field}/>}
                    name="email"
                    control={control}
                />

            </ModalContainer>
        </Spin>
    )
}


export default AddBuddyModal;

const ModalContainer = styled(Modal)``
