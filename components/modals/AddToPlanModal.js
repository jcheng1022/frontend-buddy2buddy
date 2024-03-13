import styled from "styled-components";
import {Modal} from "antd/lib";
import {useAppContext} from "@/context/app.context";

const AddToPlanModal = ({open = false, onClose = () => {}}) => {


    return (
        <ModalContainer open={open} onCancel={onClose}>
            dsds

        </ModalContainer>
    )
}

export default AddToPlanModal;

const ModalContainer = styled(Modal)`
`
