import styled from "styled-components";
import {useSearchParams} from "next/navigation";
import {useBatchById} from "@/hooks/batches.hooks";
import {theme} from "@/styles/themes";
import {FlexBox} from "@/components/common";
import {CheckSquare, ChevronRight, Edit, Edit2, Edit3, Globe, Plus, Square, Users} from "react-feather";
import {useEffect, useState} from "react";
import {Button, Checkbox, Input, notification} from "antd/lib";
import ActionBuilder from "@/components/ActionBuilder";
import {useAppContext} from "@/context/app.context";
import TaskViewerDrawer from "@/components/tasks/TaskViewerDrawer";
import {supabase} from "@/services/supabase";
import {useQueryClient} from "react-query";
import APIClient from '../../services/api'
const BatchViewer = () => {
    const search = useSearchParams();
    const client = useQueryClient();
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [hoveredTask, setHoveredTask] = useState(null)
    const [selectedTasks, setSelectedTasks] = useState([])
    const {completeTasks, moveToTrash, setCreateNewTask, setOpenCollabModal} = useAppContext();
    const [viewTask, setViewTask] = useState(null)
    const batchId = search.get('batch')
    const {data: batch} = useBatchById(batchId,  {
        withTasks: true
    })

    const [form, setForm] = useState({})

    useEffect(() => {
        if (batch) {
            setForm({
                ...form,
                name: batch?.name
            })
        }
    }, [batch])

    useEffect(() => {

        if (isEditing) {
            const inputElement = document.getElementById(`batch-name-input`);
            if (inputElement) {
                inputElement.focus();
                inputElement.select(); // Select the content

            }

        }

    }, [isEditing])
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
    const handleSubmitChanges = () => {

        if (!form.name) return;

        if (form?.name === batch?.name) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true)

        return APIClient.api.patch(`/batches/${batch?.id}`, form).then(() => {
            setIsLoading(false)
            notification.success({
                message: 'Updated',
                duration: 5,
                placement: 'bottomRight'
            })
        })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setForm({
            name: batch?.name
        })
    }
    return (
        <Container>
            <FlexBox >
                <Input className={'input-name'}
                       id={`batch-name-input`}
                       readOnly={!isEditing}
                       value={form?.name}
                       loading={!!isLoading}
                       bordered={false}
                       onChange={(e) => setForm({
                           ...form,
                           name: e.target.value
                       })}
                />


                <FlexBox justify={'flex-end'} gap={12} wrap={'no-wrap'}>

                    {isEditing ?
                        <>
                            <Button className={'batch-btn'} onClick={handleCancel} > Cancel </Button>
                            <Button className={'batch-btn'} onClick={handleSubmitChanges}> Save </Button>

                        </>
                        :
                        <>
                            <Button className={'batch-btn'} onClick={() => setIsEditing(true)}> <Edit3/> </Button>
                            <Button className={'batch-btn'} onClick={() => setOpenCollabModal(true)}> <Users/> </Button>
                            <Button className={'batch-btn'} onClick={() => setCreateNewTask(true)}> <Plus /> </Button>

                        </>
                    }





                </FlexBox>
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
  .input-name {
    max-width: 60%;
    font-size: 36px;
    color: ${theme.steel10};
    padding: 0;
    cursor: auto;

  }
  
  .batch-btn {
    padding: 4px 12px;
    min-width: 65px;
    max-width: 65px;
    //width: 100px;
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
    max-width: 60%;
    font-size: 16px;
  }
`
