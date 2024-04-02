import styled from "styled-components";
import {Button, Modal} from "antd/lib";
import {FlexBox} from "@/components/common";
import {supabase} from "@/services/supabase";

const LoginPromptModal = ({ open = false, onClose = () => {}, featureRestrict = 'false'}) => {

    const title = featureRestrict === 'true' ? 'Must be logged in to use feature' : 'Login Required'

    return (
        <ModalContainer open={open} onCancel={onClose}>
            {title}
            <FlexBox>
                <Button type={'primary'}  onClick={async () => {
                    const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            queryParams: {
                                access_type: 'offline',
                                prompt: 'consent',
                            },
                        },
                    })
                }
                }>Login</Button>
            </FlexBox>
        </ModalContainer>
    )
}


export default LoginPromptModal;

const ModalContainer = styled(Modal)`
  
`
