import styled from "styled-components";
import {Button, Modal, Select} from "antd/lib";
import {useAppContext} from "@/context/app.context";
import {useUserPlans} from "@/hooks/users.hook";
import {useAuthContext} from "@/context/auth.context";
import {Gap} from "@/components/common";
import {useState} from "react";
import APIClient from '../../services/api'

const MODAL_STATES = {
    ADD: 'add',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
}

const AddToPlanModal = ({business = null, onClose = () => {}}) => {

    console.log(business, 'check')
    const {user } = useAuthContext();
    const {data: plans} = useUserPlans(user?.id)
    console.log(user, plans, 333)
    const [modalState, setModalState] = useState(MODAL_STATES.ADD)
    const [selectedPlan, setSelectedPlan] = useState(null)

    const options = plans?.map(o => ({label: o.name, value: o.id}));

    const handleAdd = async () => {
        console.log(`trying`, selectedPlan)
        if (!selectedPlan) return;

        setModalState(MODAL_STATES.LOADING)

        await APIClient.api.post(`/planner/plan/${selectedPlan}/plan-event`, {
            planEvent: {
                businessUrl: business.url,
                businessId: business.id,
                businessName: business.name,
                img: business.image_url
            }
        }).then(() => {
            setModalState(MODAL_STATES.SUCCESS);
        })
    }
    return (
        <ModalContainer open={!!business} onCancel={onClose} footer={[]}>
            {(modalState !== MODAL_STATES.LOADING) && (
                <>
                    <div> Add to plan</div>
                    <Select options={options} onChange={(val) => setSelectedPlan(val)} style={{width: 200}} />

                    <Gap gap={24}/>
                    <div>
                        <Button onClick={handleAdd}> Add </Button>
                    </div>
                </>
            )}

            {modalState === MODAL_STATES.SUCCESS && (
                <>
                    <div>done</div>

                </>
            )}


        </ModalContainer>
    )
}

export default AddToPlanModal;

const ModalContainer = styled(Modal)`
`
