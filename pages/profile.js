import Layout from "@/layouts";
import styled from "styled-components";
import {useAuthContext} from "@/context/auth.context";
import {useUserInterests} from "@/hooks/interests.hooks";


const Profile = () => {
    const {user} = useAuthContext();

    const {data: interests, isLoading, isFetching} = useUserInterests(user?.id)
    return (
        <Layout>
            <Container>


                <SectionContainer>


                    {/*<OverflowScrollContainer title={'My Interests'} paginate={interests?.length > 1}>*/}
                    {/*    {interests?.map(e => <div style={{width: 300}}> hi</div>)}*/}
                    {/*</OverflowScrollContainer>*/}

                    <div className={'list-container'}>
                            {interests?.map(e => <div style={{width: 300, height: 300}}> hi</div>)}

                    </div>
                    {/*{interests}*/}


                </SectionContainer>

                <SectionContainer>
                    <div className={'section-title'}>
                        Interests
                    </div>


                </SectionContainer>





            </Container>
        </Layout>
    )
}

export default Profile;

const Container = styled.div`
  padding: 24px;
`

const SectionContainer = styled.div`
  
  min-height: 200px;
  
  
  .section-title {
    
  }
  
  .list-container {
    display: flex;
    
    width: 300px;
    overflow-x: auto;
  }
`
