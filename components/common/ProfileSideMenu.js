import styled from 'styled-components';
import {useAuthContext} from "@/context/auth.context";
import {ColorScrollBar, FlexBox, Gap} from "@/components/common/index";
import {theme} from "@/styles/themes";
import {CheckSquare, File, Folder, Home, Loader, Plus, Trash2, Users, Zap} from "react-feather";
import {useAppContext} from "@/context/app.context";
import {useRouter} from "next/router";
import {useUserMenuData} from "@/hooks/users.hook";
import APIClient from '../../services/api'
import {useQueryClient} from "react-query";
import {useEffect, useState} from "react";
import {Collapse, notification, Progress} from "antd/lib";
import {useSearchParams} from "next/navigation";
import {supabase} from "@/services/supabase";

const {Panel} = Collapse

const ProfileSideMenu = () => {

  const {user} = useAuthContext();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false)
  const { setSelectedTab, selectedTab, setCreateNewTask} = useAppContext();
  const {data: menuData} = useUserMenuData();
  const client = useQueryClient()
    const [newlyCreatedIndex, setNewlyCreatedIndex] = useState(null)
    const search = useSearchParams();

  const batchId = search.get('batch')


    useEffect(() => {
        supabase
            .channel('batch-task-updates-menu')
            .on('postgres_changes', { event: '*', schema: 'public', tables: ['batches', 'tasks'] }, payload => {
                client.refetchQueries(['menu']);
            })
            .subscribe();


    }, [])
  const handleAddBatch = () => {
      setIsAdding(true)
      return APIClient.api.post('/batches').then( async () => {
           // await client.refetchQueries(['menu'])
          setIsAdding(false)
          setNewlyCreatedIndex(menuData?.batches?.length -1 )
      }).catch((err) => {
          setIsAdding(false)
          notification.error({
              message: 'Failed',
              description: 'Failed to create batch',
              duration: 4
          })
      })
  }

  const handleClick = (type, {batchId, taskId}) => () => {
      if (type === 'batch') {
          router.push({
              pathname: `/user/${user?.id}`,
              query: {
                  batch: batchId
              }
          })
          // router.push(`/user/${user?.id}/?batch=${batchId}`)
      } else if (type === 'batch-task') {
          router.push({
              pathname: `/user/${user?.id}`,
              query: {
                  batch: batchId,
                  task: taskId
              }
          })
      }else if (type === 'task') {
          router.push({
              pathname: `/user/${user?.id}`,
              query: {
                  task: taskId
              }
          })
      }
  }



  const actionTabs = [
      { label: 'Today',
      icon: <Home size={18} />
      },
      { label: 'Friends',
          icon: <Users size={18} />,
          extra: <div style={{marginLeft: 4}}> ({menuData?.friendCount?.count})</div>
      },
      { label: 'Important',
          icon: <Zap size={18} />
      },
      // { label: 'Pending',
      //     icon: <Clock size={18} />
      // },
      { label: 'Trash',
          icon: <Trash2 size={18} />
      },
  ]

    const handleActionSelect = (index) => async() => {

        await router.push(`/user/${user?.id}?tab=${actionTabs[index].label.toLowerCase()}`);
    }



    return (
        <Container>
          <FlexBox className={'user-section'} gap={24} wrap={'no-wrap'}>

              <div className={'user-logo-container'}>
                  <div className={'user-logo'}> { !!user?.username && user?.username[0].toUpperCase()}</div>
              </div>
            <div className={'user-username'}> {user?.username}</div>
          </FlexBox>


            <Gap gap={24}/>
            <MiddleSection >

                <ActionTabsContainer>

                    <div className={'action-heading'}> Actions</div>


                    {actionTabs.map((action, index) => {
                        return (
                            <ActionItem key={`action-item-${index}`} isSelected={selectedTab === actionTabs[index].label.toLowerCase()} onClick={ handleActionSelect(index)}>
                                <div className={'action-icon'}>
                                    {action.icon}
                                </div>
                                <div className={'action-name'}> {action.label}</div>
                                { action?.extra}


                            </ActionItem>
                        )
                    })}

                </ActionTabsContainer>

                <Gap gap={24}/>

                <BatchNavContainer>

                   <FlexBox justify={'space-between'} style={{marginRight:14}}>
                       <div className={'heading'}> Batches</div>
                       <div style={{cursor:'pointer'}} onClick={handleAddBatch}>
                        <Plus color={theme.steel10} size={14}/>
                       </div>
                   </FlexBox>

                    {menuData?.batches?.map((batch, index) => {
                        const findCompletionPercentage = ((batch?.tasks.filter(o => o.status === 'COMPLETE').length) / (batch?.tasks.length)) * 100

                        const progressColor = (findCompletionPercentage === 0 || !findCompletionPercentage) ? 'white' : findCompletionPercentage < 100 ? theme.ashGrey : '#73c45a'
                        return (
                            <Collapse  key={`menu-batch-${batch.id}`} accordian bordered={false}>
                               <Panel header={ <BatchItem isSelected={batchId === batch.id}  className={'batch-item'} onClick={handleClick('batch', {batchId:  batch.id})}>
                                   <div className={'batch-icon'}>
                                       <Folder size={18}/>
                                   </div>
                                   <div className={'batch-name'}>
                                       {batch.name}
                                   </div>
                                   {batch?.tasks.length > 0 && (
                                       <FlexBox justify={'flex-end'} className={'batch-progress'}>
                                           <Progress size={14}
                                                     type="circle"
                                                     strokeColor={progressColor}
                                                     percent={findCompletionPercentage} />
                                       </FlexBox>
                                       )}
                               </BatchItem>} key={`panel-batch-${index}`}>
                                   {batch.tasks?.map((task, taskIndex) => (
                                       <TaskItem key={`menu-task-${index}`}
                                                 isBatch={true}
                                                 className={'task-item'}
                                                 onClick={handleClick('batch-task', {batchId: batch.id, taskId: task.id})}>
                                           <div className={'task-icon'}>
                                               {task.status !== 'COMPLETE' ? <File size={18}/> : <CheckSquare size={18} />}
                                           </div>
                                           <div className={'task-name'}>
                                               {task.name}
                                           </div>
                                       </TaskItem>
                                   ))}
                               </Panel>

                            </Collapse>
                        )
                    })}
                    {isAdding &&  <FlexBox className={'items'} onClick={handleAddBatch}>
                        <div> <Loader size={18} color={theme.steel40}/></div>
                        <div className={'create-new-batch-text'}> Creating...</div>
                    </FlexBox>}

                </BatchNavContainer>

                <Gap gap={24}/>

                {/*<TaskNavContainer>*/}

                {/*    <FlexBox justify={'space-between'} style={{marginRight:14}}>*/}
                {/*        <div className={'heading'}> Tasks </div>*/}
                {/*        <div style={{cursor:'pointer'}} onClick={() => setCreateNewTask(true)}>*/}
                {/*            <Plus color={theme.steel10} size={14}/>*/}
                {/*        </div>*/}
                {/*    </FlexBox>*/}

                {/*    {menuData?.tasks?.map((task, index) => {*/}
                {/*        return (*/}
                {/*            <TaskItem key={`menu-task-${index}`} className={'task-item'} onClick={handleClick('task', {taskId:  task.id})}>*/}
                {/*                <div className={'task-icon'}>*/}
                {/*                    {task.length !== 0 ? <File size={18}/> : <FileText size={18} />}*/}
                {/*                </div>*/}
                {/*                <div className={'task-name'}>*/}
                {/*                    {task.name}*/}
                {/*                </div>*/}
                {/*            </TaskItem>*/}
                {/*        )*/}
                {/*    })}*/}
                {/*    {isAdding &&  <FlexBox className={'items'} onClick={handleAddBatch}>*/}
                {/*        <div> <Loader size={18} color={theme.steel40}/></div>*/}
                {/*        <div className={'create-new-task-text'}> Creating...</div>*/}
                {/*    </FlexBox>}*/}
                {/*    <FlexBox className={'items'} onClick={handleAddBatch}>*/}
                {/*        <div> <PlusSquare size={18} color={theme.steel40}/></div>*/}
                {/*        <div className={'create-new-task-text'}> Create New</div>*/}
                {/*    </FlexBox>*/}

                {/*</TaskNavContainer>*/}
            </MiddleSection>


            <MenuFooter>
                some footer stuff that i didnt build yet
            </MenuFooter>
        </Container>
    );
}

export default ProfileSideMenu;

const MiddleSection = styled.div`
max-height: 70%;
  overflow-y: auto;

`
const Container = styled.div`
  width: 30%;
  max-width: 30%;
  background-color: ${theme.jet};
  height: 100vh;
  padding: 12px 24px;
  
  ${ColorScrollBar(theme.ashGrey, 6)}
  .ant-collapse-expand-icon {
    color: ${theme.steel10};
  }

  .ant-collapse>.ant-collapse-item >.ant-collapse-header {
    padding: 0px;
  }

  .ant-collapse-content-box {
    padding-top: 0;
  }



  .sidemenu-bottom {
    position: absolute;;
  }

  .user-username {
    letter-spacing: 1px;
    font-size: 18px;
    color: ${theme.ashGrey};
  }
  .user-section {
    width: 100%;
  }


  .user-logo-container {
    display: inline-block;
    text-align: center;
    min-width: 30px;
    min-height: 30px;
    background-color: ${theme.ashGrey};
    border-radius: 50%;
    position: relative;
  }

  .user-logo {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 30px;
    height: 22px;
  }
`


const ActionTabsContainer = styled.div`
    min-height: 150px;
  
  .action-heading {
    color: ${theme.steel20};
    font-weight: 500;
    font-style: italic;
    letter-spacing: 1px;
    font-size: 12px;
    margin-bottom: 4px;
  }
  
`

const ActionItem = styled.div`
  display: flex;
  align-items: center; // Align items vertically in the center
  width: 80%;
  border-right: ${props => props.isSelected ? `5px solid ${theme.ashGrey}` : 'none'};

  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
    color:  ${props => !props.isSelected ? theme.steel10 : 'black'};
  background-color:  ${props => props.isSelected ? theme.steel10 : theme.jet};

  // margin: 8px  ${props => props.isSelected ? '12px' : '0px'};
  // background: ${props => props.isSelected ? `linear-gradient(to right, ${theme.steel60}, rgba(0, 0, 0, 0))`  : 'none'};
  //border-top-left-radius: 24px;
  //border-bottom-left-radius: 24px;
  
  .action-icon {
    display: inline-block;
    margin-right: 12px;
  }


  &:hover {
    background-color: ${props => !props.isSelected && '#3e4040'};
    cursor: pointer;
  }
`


const BatchNavContainer = styled.div`

  .items {
    padding: 8px 12px;
    border-radius: 4px;
  }
  .items:hover { 
    background-color: #3e4040;
    cursor: pointer;
  }
  .heading {
    color: ${theme.steel20};
    font-weight: 500;
    font-size: 12px;
    font-style: italic;
    letter-spacing: 1px;
    margin-bottom: 4px;
    
  }
  
  .create-new-batch-text{
    color: ${theme.steel10};
    margin-left: 12px;
  }
`

const BatchItem = styled(FlexBox)`
  color: ${theme.steel10};
  background-color: ${props => props.isSelected && '#3e4040'};
  padding: 4px;
    .batch-icon {
      margin-right: 12px;
      
    }
  
  .batch-progress {
    margin-right: 24px;
  }
  
  &:hover {
    background-color: #3e4040;
    cursor: pointer;
  }
`

const MenuFooter = styled.div`

    padding: 12px;
  color:${theme.steel10};
`


const TaskNavContainer = styled.div`

  .items {
    padding: 8px 12px;
    border-radius: 4px;
  }
  .items:hover { 
    background-color: #3e4040;
    cursor: pointer;
  }
  .heading {
    color: ${theme.steel20};
    font-weight: 500;
    font-size: 12px;
    font-style: italic;
    letter-spacing: 1px;
    margin-bottom: 4px;
    
  }
  
  .create-new-batch-text{
    color: ${theme.steel10};
    margin-left: 12px;
  }
`

const TaskItem = styled(FlexBox)`
  flex-wrap: nowrap;
  color: ${theme.steel10};
  
  .task-name {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  //padding: 8px 8px;
  padding: ${props => props.isBatch ? '4px': '8px 8px'};

  margin: ${props => props.isBatch ? '2px 0px 2px 28px': '0px'};

  .task-icon {
      margin-right: 12px;
      
    }
`
