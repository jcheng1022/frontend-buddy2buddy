import styled from "styled-components";
import {Button, Checkbox, DatePicker, Input, Modal, Select, Spin, Steps} from "antd/lib";
import {useAppContext} from "@/context/app.context";
import {Controller, useForm} from "react-hook-form";
import {useMemo, useState} from "react";
import APIClient from "@/services/api";
import {useQueryClient} from "react-query";
import {useAuthContext} from "@/context/auth.context";
import {Gap} from "@/components/common";
import {useUserBuddies} from "@/hooks/users.hook";
import dayjs from "dayjs";

const CreatePlanModal = () => {
    const {openCreatePlan, closeCreatePlan} = useAppContext()
    const {user} = useAuthContext();
    const [step, setStep] = useState(0);
    const { data: buddies } = useUserBuddies(user?.id)
    const { handleSubmit, control, setValue, getValues, register, reset } = useForm({
        defaultValues: {
            name: ''
        },
    });
    const client = useQueryClient();
    const [isLoading, setIsLoading] = useState(false)

    const addBuddyOptions = useMemo(() => {


        return buddies?.filter((o => o.status === 'ACCEPTED')).map((buddy) => {
            return {
                label: `${buddy.friendName} - ${buddy.friendEmail}`,
                value: buddy.friendId
            }
        })
    }, [buddies, user])

    const onSubmit = () => {
        const formData = getValues();

        setIsLoading(true)
        return APIClient.api.post(`/planner/plan`, formData).then((data) => {
            // setResults(data)
        } ).finally(async () => {
            setIsLoading(false)
            await client.refetchQueries(['profile', user?.id])
            closeCreatePlan()

        })

    }
    const vals = getValues();

    const steps = [
        {
            title: 'Setup',
            content: 'First-content',
        },
        {
            title: 'Confirm',
            content: 'Second-content',
        },
        {
            title: 'Sending Invites',
            content: 'Last-content',
        },
        {
            title: 'Complete',
            content: 'Last-content',
        },
    ];
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    return (
       <Spin spinning={isLoading}>
           <ModalContainer open={openCreatePlan} onCancel={closeCreatePlan} footer={[]}
           //                 footer={[
           //     <Button onClick={() => {}}>
           //         Cancel
           //     </Button>,
           //     <Button loading={isLoading} onClick={onSubmit} type={'primary'}>
           //         Create
           //     </Button>
           // ]}
           >


               <div> Create New Hangout </div>
               <Gap gap={14}/>

               <Steps current={step} items={items} />


               <Gap gap={14}/>

               {step === 0 && (
                   <>
                       <Controller
                           render={({ field }) => <Input
                               {...register('name')}
                               placeholder={'e.g: Weekend Hangout'} {...field}/>}
                           name="name"
                           control={control}
                       />

                       <Gap gap={14}/>

                       <Controller
                           render={({ field }) =>
                               <DatePicker
                                   {...register('date')}
                                   placeholder={'e.g: Feb 02 2024'} {...field}/>}
                           name="date"
                           control={control}
                       />
                       <Gap gap={14}/>
                       <Controller
                           render={({ field }) =>
                               <Select
                                   style={{ width: '100%' }}
                                   options={addBuddyOptions}
                                   mode={'multiple'}
                                   {...register('buddies')}
                                   placeholder={'Add friends'} {...field}/>}
                           name="buddies"
                           control={control}
                       />
                       <Gap gap={14}/>
                       <Controller
                           render={({ field }) =>
                               <Checkbox

                                   {...register('includeMe')}
                                   {...field}/>}
                           name="includeMe"
                           control={control}
                       />
                       <span> Include me</span>

                   </>
               )}

               {step === 1 && (

                   <>
                    <div> Confirm plan details</div>
                       <div>
                            Plan Name: <span> {vals?.name}</span>
                       </div>
                       <div>
                           Scheduled date: <span> {dayjs(vals?.date).format('MMM Do YYYY')}</span>
                       </div>

                       <div>
                           Invitees:
                           {vals?.buddies?.map((buddy) => {
                               const friend = buddies?.find(o => o.friendId === buddy)
                               return (
                                   <div> {friend.friendName} - {friend.friendEmail} </div>
                               )
                           })}
                       </div>
                   </>

               )}
               <div
                   style={{
                       marginTop: 24,
                   }}
               >
                   {step < steps.length - 1 && (
                       <Button type="primary" onClick={() => setStep(prev => prev+ 1)}>
                           Next
                       </Button>
                   )}
                   {step === steps.length - 1 && (
                       <Button type="primary" onClick={onSubmit}> Create </Button>)}

                   {step > 0 && (
                       <Button
                           style={{
                               margin: '0 8px',
                           }}
                           onClick={() => setStep(prev => prev - 1)}
                       >
                           Previous
                       </Button>
                   )}
               </div>

           </ModalContainer>
       </Spin>
    )
}


export default CreatePlanModal;

const ModalContainer = styled(Modal)``
