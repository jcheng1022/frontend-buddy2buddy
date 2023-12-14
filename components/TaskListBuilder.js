import styled from 'styled-components';
import {FlexBox} from "@/components/common";
import {Checkbox, Tag} from "antd/lib";
import {theme} from "@/styles/themes";
import TaskViewerDrawer from "@/components/tasks/TaskViewerDrawer";
import {useState} from "react";

const TaskListBuilder = ({list = [], selectedList = [], setSelectedList}) => {
    const [viewTask, setViewTask] = useState(null)
    const handleSelectTask = (taskId) => {
        const isTaskSelected = selectedList.includes(taskId);

        if (isTaskSelected) {
            setSelectedList((prevSelectedTasks) => prevSelectedTasks.filter((id) => id !== taskId));
        } else {
            setSelectedList((prevSelectedTasks) => [...prevSelectedTasks, taskId]);
        }
    }

    const handleUnselect = () => {
        setSelectedList([])
    }
    return (
        <Container>
            {list?.map(task => {
                return (
                    <TaskItem key={`task-item-${task.id}`} align={'flex-start'} justify={'flex-start'} direction={'column'} onClick={() => setViewTask(task?.id)}>
                        {/*<FlexBox justify={'flex-end'}>*/}
                        {/*    <Tag> <Zap size={18}/> </Tag>*/}
                        {/*</FlexBox>*/}

                        <FlexBox justify={'space-between'} style={{width: '100%'}}>
                            <FlexBox gap={8}>
                                <Checkbox checked={selectedList.includes(task.id)} onChange={() => handleSelectTask(task.id)} />
                                <div>
                                    {task.name}
                                </div>
                            </FlexBox>

                            {task.isImportant &&  <Tag color={theme.lightLavender}> <div className={'tag-text'}> Important</div> </Tag>}

                        </FlexBox>

                        <div>
                            {task?.description}
                        </div>

                    </TaskItem>
                )
            })}

            <TaskViewerDrawer taskId={viewTask} onClose={() => setViewTask(null)} />

        </Container>
    );
}

export default TaskListBuilder;

const Container = styled.div``

const TaskItem = styled(FlexBox)`
  padding: 12px;
  margin: 8px 0px;
    background-color: ${theme.ashGrey};
  border-radius: 12px;
  height: 100px;
  cursor: pointer;
  
  &:hover {
    scale:1.01;
    background-color: ${theme.ashGrey_2};


  }
  .tag-text {
    color: #D62246;
    font-weight: 500;
  }
`
