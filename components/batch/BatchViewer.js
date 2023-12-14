import styled from "styled-components";
import {useSearchParams} from "next/navigation";
import {useBatchById} from "@/hooks/batches.hooks";
import {theme} from "@/styles/themes";
import {FlexBox} from "@/components/common";
import {CheckSquare, ChevronRight, Square} from "react-feather";
import {useEffect, useState} from "react";
import {Button, Checkbox} from "antd/lib";
import ActionBuilder from "@/components/ActionBuilder";
import {useAppContext} from "@/context/app.context";
import TaskViewerDrawer from "@/components/tasks/TaskViewerDrawer";
import {supabase} from "@/services/supabase";
import {useQueryClient} from "react-query";

const BatchViewer = () => {
    const search = useSearchParams();
    const client = useQueryClient();
    const [hoveredTask, setHoveredTask] = useState(null)
    const [selectedTasks, setSelectedTasks] = useState([])
    const {completeTasks, moveToTrash, setCreateNewTask} = useAppContext();
    const [viewTask, setViewTask] = useState(null)
    const batchId = search.get('batch')
    const {data: batch} = useBatchById(batchId,  {
        withTasks: true
    })
    useEffect(() => {
        supabase
            .channel('batch-task-updates')
            .on('postgres_changes', { event: '*', schema: 'public', tables: ['batches', 'tasks'] }, payload => {
                client.refetchQueries(['batch', batchId]);
                setSelectedTasks([])
            })
            .subscribe();


    }, [])

    const handleUnselect = () => {
        setSelectedTasks([])
    }
    const handleTaskSelected = (taskId) => () => {
        const isTaskSelected = selectedTasks.includes(taskId);
        if (isTaskSelected) {
            setSelectedTasks((prevSelectedTasks) => prevSelectedTasks.filter((id) => id !== taskId));
        } else {
            setSelectedTasks((prevSelectedTasks) => [...prevSelectedTasks, taskId]);
        }
    }


    const btnConfig = [
        {
            onClick:  completeTasks(selectedTasks),
            className: 'btn complete-btn',
            label: `Complete ${selectedTasks.length} tasks`
        },
        {
            onClick: moveToTrash(selectedTasks),
            className: 'btn delete-btn',
            label: `Delete ${selectedTasks.length} tasks`
        },
        {
            onClick: handleUnselect,
            className: 'btn unselect-btn',
            label: `Unselect ${selectedTasks.length} tasks`
        },
    ]

    const statusOrder = ['INCOMPLETE', 'PENDING', 'COMPLETE'];

    return (
        <Container>
            <FlexBox justify={'space-between'}>
                <div className={'name'}> {batch?.name} </div>
                <Button onClick={() => setCreateNewTask(true)}> New Task</Button>

            </FlexBox>
            <div className={'description'}> {batch?.description} </div>
            {selectedTasks?.length > 0 && <ActionBuilder arr={selectedTasks} setArr={setSelectedTasks}  />}
            {batch?.tasks?.sort((a, b) => {
                return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
            }).map((task) => {
                return (
                    <TaskContainer key={`batch-task-${task.id}`} isComplete={task.status === 'COMPLETE'}>
                        <div className={'icon'}
                             onMouseEnter={() => task.status !== 'COMPLETE' && setHoveredTask(task.id)}
                             onMouseLeave={() => setHoveredTask(null)}>
                            { task.status !== 'COMPLETE' &&  (hoveredTask === task.id || selectedTasks.includes(task.id)) ? <Checkbox  checked={selectedTasks.includes(task.id)} onChange={handleTaskSelected(task.id)} /> : task.status === 'COMPLETE'  ?  <CheckSquare size={18}/> : <Square size={18}/>}
                        </div>
                        <FlexBox  onClick={() => {
                            setViewTask(task.id)
                        }}>
                            <div className={'name'}>
                                {task.name}
                            </div>
                            <FlexBox className={'icon chevron-icon'} justify={'flex-end'}>
                                <ChevronRight size={18}/>
                            </FlexBox>
                        </FlexBox>
                    </TaskContainer>
                )
            })}

           <TaskViewerDrawer taskId={viewTask} onClose={() => setViewTask(null)} />
        </Container>
    )
}

export default BatchViewer;

const Container = styled.div`
  .name {
    font-size: 36px;
    color: ${theme.steel10};
    
  }
  
  .description {
    font-size: 18px;
    color: ${theme.steel20};
    
  }
`

const TaskContainer = styled(FlexBox)`
    margin: 8px 0px;
  padding: 8px 12px;
  border-radius: 4px;
    background-color: ${props => props.isComplete ? '#8e99ab' : theme.ashGrey};
  cursor: pointer;
  
  &:hover {
    scale:1.01;
    background-color: ${props => props.isComplete ? '#7f8999' : theme.ashGrey_2};


  }
  
  .icon {
    margin-right: 18px;
    color: ${theme.steel10};
  }

  .chevron-icon {
    opacity: 0; /* Start with zero opacity */
    //visibility: hidden; /* Start with hidden visibility */
    transition: opacity 0.2s ease, visibility 0.2s ease; /* Add a smooth transition effect */
  }

  .chevron-icon:hover {
    opacity: 1; /* Show the chevron on hover */
    //visibility: visible;
  }
  .name { 
    font-size: 16px;
  }
`
