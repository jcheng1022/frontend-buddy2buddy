import styled from "styled-components";
import Modal from "antd/lib/modal/Modal";
import {useAppContext} from "@/context/app.context";
import YelpResultsList from "@/components/YelpResultsList";
import {Button} from "antd/lib";

const YelpResultsModal = () => {

    const  {yelpResults, setYelpResults} = useAppContext()

    const onClose = () => {
        setYelpResults([])
    }


    const footer = [
        <Button onClick={onClose}>
            Close
        </Button>

    ]
    return (
        <Container
            width={'100%'}
            closable={false}
            centered={true}
            footer={footer}
            maskClosable={false}
            open={yelpResults.length > 0}
            onCancel={onClose}>

            {yelpResults?.length > 0 && <YelpResultsList list={yelpResults}/>}
        </Container>
    )
}


export default YelpResultsModal;

const Container = styled(Modal)`

    //.ant-modal-content {
    //  width: 900px;
    //}
`
