import styled from "styled-components";
import Layout from "@/layouts";
import ProfileLayout from "@/layouts/profileLayout";
import {useAppContext} from "@/context/app.context";
import TodayTasks from "@/components/profile/TodayTasks";
import AllTasks from "@/components/profile/AllTasks";
import ImportantTasks from "@/components/profile/ImportantTasks";
import PendingTasks from "@/components/profile/PendingTasks";
import {theme} from "@/styles/themes";
import TrashedTasks from "@/components/profile/TrashedTasks";
import {useSearchParams} from "next/navigation";
import BatchViewer from "@/components/batch/BatchViewer";
import {FlexBox} from "@/components/common";
import {Button} from "antd/lib";
import FriendsContainer from "@/components/friends/FriendsContainer";

const UserProfilePage = () => {
    const {selectedTab, setCreateNewTask} = useAppContext();
    const searchParams = useSearchParams();
    const batchId = searchParams.get('batch')
    const taskId = searchParams.get('task')

    let pageType = null;
    if (!taskId && !!batchId) {
        pageType = 'batch'
    } else if (!batchId && !!taskId) {
        pageType = 'task'
    } else if (!!batchId && !!taskId) {
        pageType = 'batch-task'
    }




    let contentToRender;

    if (pageType === 'batch') {
        // Render batch content
        contentToRender = <BatchViewer/>;
    } else if (pageType === 'task') {
        // Render task content
        contentToRender = <div> task page </div>;
    } else if (pageType === 'batch-task') {
        // Render batch-task content
        contentToRender = <div> batch task page </div>;
    } else {
        // Render based on selectedTab when pageType is null
        if (selectedTab === 'today') {
            contentToRender = <TodayTasks />;
        } else if (selectedTab === 'friends') {
            contentToRender = <FriendsContainer />;
        } else if (selectedTab === 'all') {
            contentToRender = <AllTasks />;
        } else if (selectedTab === 'important') {
            contentToRender = <ImportantTasks />;
        } else if (selectedTab === 'pending') {
            contentToRender = <PendingTasks />;
        } else if (selectedTab === 'trash') {
            contentToRender = <TrashedTasks />;
        }
    }

    let getWelcomeText;
    if (selectedTab === 'today') {
        getWelcomeText =  `Here's your tasks for today!`

    } else if (selectedTab === 'friends') {
        getWelcomeText =`Your friends`

    }else if (selectedTab === 'all') {
        getWelcomeText =`All your planned tasks`

    }else if (selectedTab === 'important') {
        getWelcomeText = `Your important tasks`

    }else if (selectedTab === 'pending') {
        getWelcomeText = `Your tasks waiting to be started`

    }else if (selectedTab === 'trash') {
        getWelcomeText = `Your tasks in trash`

    }



    return (
        <Layout>
            <ProfileLayout>
                <Container>

                    {!pageType && selectedTab !== 'friends' && (
                       <>
                           <FlexBox justify={'space-between'}>
                               <div className={'welcome-text'}>  {getWelcomeText} </div>
                               <Button onClick={() => setCreateNewTask(true)}> New Task</Button>

                           </FlexBox>

                       </>
                        )}
                    {contentToRender}

                </Container>
            </ProfileLayout>
        </Layout>
    )
}

export default UserProfilePage;

const Container = styled.div`
  padding: 24px 36px;
  background-color: ${theme.jet};
  height: 100vh;
  width: 100vw;

.welcome-text {
  font-size: 24px;
  color: ${theme.steel10};
  letter-spacing: 1px;
  
  
}
  
.tab-specific-text {
  color: ${theme.ashGrey};
  font-size: 14px;
  
}  
`
