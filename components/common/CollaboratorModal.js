import styled from "styled-components";
import {Modal} from "antd/lib";
import {useAppContext} from "@/context/app.context";

const CollaboratorModal = () => {
    const {openCollabModal, setOpenCollabModal} = useAppContext()
    return (
        <Container open={openCollabModal} onCancel={() => setOpenCollabModal(false)}>
            sdsds
        </Container>
    )
}

export default CollaboratorModal;

const Container = styled(Modal)``
