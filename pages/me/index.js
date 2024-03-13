import styled from "styled-components";
import Layout from "@/layouts";
import {useAppContext} from "@/context/app.context";
import MyInterests from "@/components/features/MyInterests";
import {useSearchParams} from "next/navigation";
import PlannerFeature from "@/components/features/Planner";
import FriendsPage from "@/components/features/Friends";

const UserPage = () => {

    const { yelpResults } = useAppContext()
    const search = useSearchParams();

    const tabItems = [
        {
            label: 'My Interests',
            key: `interests`,
            children: <MyInterests/>
        },
        {
            label: 'Buddy Plans',
            key: `buddy-plans`,
            children: <PlannerFeature/>
        },
        // {
        //     label: 'My Interests',
        //     key: `interests`,
        //     children: <div> interest list</div>
        // }
    ]
    const contentToShow = search.get('type') ?? 'business'
    return (
        <Layout isInterest={contentToShow === 'business'}>
            <Container>

                {contentToShow === 'business' && <MyInterests/>}
                {contentToShow === 'planner' && <PlannerFeature />}
                {/*{contentToShow === 'friends' && <FriendsPage />}*/}



            </Container>
        </Layout>
    )
}


export default UserPage;

const Container = styled.div`
  padding: 12px;
`
