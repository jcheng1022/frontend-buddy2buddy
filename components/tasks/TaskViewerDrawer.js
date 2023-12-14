import {Checkbox, Drawer, Input} from "antd/lib";
import styled from "styled-components";
import {ArrowLeft} from "react-feather";
import {useTaskById} from "@/hooks/tasks.hooks";
import {FlexBox, Gap} from "@/components/common";
import {theme} from "@/styles/themes";
import {useCallback, useEffect, useState} from "react";
import TextArea from "antd/lib/input/TextArea";
import APIClient from '../../services/api'
import _, {debounce} from "lodash";
import {getTimeSince} from "@/utils/getTimeSince";
import {useQueryClient} from "react-query";
import {DndContext} from "@dnd-kit/core";
import {Droppable} from "@/components/dnd/Droppable";
import {Draggable} from "@/components/dnd/Draggable";
import {useRouter} from "next/router";

const TaskViewerDrawer = ({taskId = '' , onClose}) => {
    const  {data: task} = useTaskById(taskId);
    const router = useRouter();
    const {batch} = router.query
    const [isDragging, setIsDragging] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const client = useQueryClient();
    const [parent, setParent] = useState([]);

    const [form, setForm] = useState({

    })


    const updateData =async () => {

        if (!task?.id || !isDirty) return;

        await APIClient.api.patch(`/tasks/${task?.id}/details`, form).then(async () => {
            await client.refetchQueries(['task', task?.id,])
            await client.refetchQueries(['batch', batch])
            setIsUpdating(false)
            if (parent) {
                setParent([])
            }
        }).catch((e) => {
            setIsUpdating(false)
        })
    }
    const debounceForm = useCallback(debounce(updateData, 2000) , [ form])

    useEffect(() => {
        if (task) {
            setForm({
                name: task.name,
                description: task.description,
                status: task.status,
                subtaskList: task.subtaskList
            })
        }
    }, [task])
    const isDirty = !!task && ( !_.isEqual(form?.subtaskList, task?.subtaskList) || (form?.name !== task?.name) || (form?.description !== task?.description))

    useEffect(() => {

            debounceForm();

    }, [form]);



    const handleCheck = (index) => () => {
        setForm((prevForm) => {
            const updatedData = [...prevForm.subtaskList];
            updatedData[index] = {
                ...updatedData[index],
                isComplete: !updatedData[index].isComplete,
            };

            return { ...prevForm, subtaskList: updatedData };
        });
        setIsUpdating(true);



    }


    const handleInputChange = (type) => (e) => {
        const value = typeof e === 'object' ? e.target.value : e
        setForm({
            ...form,
            [type]: value
        })

      setIsUpdating(true)


    }

    const handleSubtaskIndex = (index) => (e) => {
        const value = typeof e === 'object' ? e.target.value : e;
        setForm((prevForm) => {
            const updatedData = [...prevForm.subtaskList];
            updatedData[index] = {
                ...updatedData[index],
                text: value,
            };

            return { ...prevForm, subtaskList: updatedData };
        });
        setIsUpdating(true);

    };


    function handleDragEnd(event) {

        const { over, active } = event;
        if (over && active) {

            const startIndex = active.id.split('-').pop();
            const endIndex = over.id.split('-').pop();
            if (startIndex === endIndex) {

                const inputElement = document.getElementById(`subtask-input-${startIndex }`);
                if (inputElement) {

                    inputElement.focus();
                }
                return;
            }

            if (!isNaN(startIndex) && !isNaN(endIndex)) {
                setIsUpdating(true);

                const updatedSubtaskList = [...form?.subtaskList];

                const [draggedItem] = updatedSubtaskList.splice(startIndex, 1);
                updatedSubtaskList.splice(endIndex, 0, draggedItem);

                const updatedList = updatedSubtaskList.map((o, index) => ({...o, priority: index + 1}))
                setForm((prevForm) => ({
                    ...prevForm,
                    subtaskList: updatedList
                }))

            }
        }


    }

    const HoverableNode = ({children, isHovered = false}) => {
        return (
            <HoverItem isHovered={isHovered}>
                {isHovered && <div> HOVERs </div>}
                {children}
            </HoverItem>
        )
    }

    if (!task) return null;

    return (
        <Drawer open={taskId}
                onClose={onClose}
                width={'70%'}
                closeIcon={<ArrowLeft />}
                extra={isUpdating ? 'Updating...' : getTimeSince(task?.updatedAt)}

        >
            <Container>

                <TaskDataContainer>

                    {/*<HoverableNode isHovered={false}>*/}
                    {/*    <Input className={'title'} value={form?.name} onChange={handleInputChange('name')} bordered={false} />*/}
                    {/*</HoverableNode>*/}

                    <Input className={'title'} value={form?.name} onChange={handleInputChange('name')} bordered={false} />
                    <TextArea className={'task-description'} value={form?.description} onChange={handleInputChange('description')} bordered={false} />


                    <div className={'subtask-title'}> Sub tasks</div>

                    <div className={'subtask-description'}> Mark subtasks as you complete</div>

                    <Gap gap={12}/>
                    <DndContext

                        onDragEnd={handleDragEnd}>
                        <FlexBox direction={'column'} align={'flex-start'}>
                            {form?.subtaskList?.map((item, index) => (
                                <Draggable key={`draggable-${index}`} id={`draggable-${index}`}>
                                    <Droppable key={`droppable-${index}`} id={`droppable-${index}`}>
                                            <TaskItem key={`task-item-${index}`} gap={12} isComplete={item.isComplete} wrap={'no-wrap'}>
                                                <Checkbox onChange={handleCheck(index)} checked={item.isComplete} />
                                                <Input id={`subtask-input-${index}`} onChange={handleSubtaskIndex(index)} bordered={false} value={item.text} className={'item-text'}/>
                                            </TaskItem>

                                    </Droppable>
                                </Draggable>
                            ))}
                        </FlexBox>
                    </DndContext>

                </TaskDataContainer>
            </Container>
        </Drawer>
    )
}


export default TaskViewerDrawer;

const Container = styled.div``


const TaskDataContainer = styled.div`
  margin: 8px 0px;
  cursor: grab;
  .title {
    font-size: 18px;
    padding: 0px 4px;
    color: ${props => props.isComplete && 'red'};
  }
  
  .title:hover { 
    background-color: ${theme.steel10};
  }
  
  .subtask-title {
    font-size: 18px;
    font-weight: 500;
  }
  .subtask-description {
    font-size: 12px;
    color: ${theme.steel40};
  }
  
  .task-description {
    padding: 0px;
  }
  .task-description:hover {
    background-color: ${theme.steel10};
  }
`

const TaskItem = styled(FlexBox)`
  padding: 12px 4px;
  border-radius: 4px;
  .item-text {
    text-decoration: ${props => props.isComplete && 'line-through'};
  }
  
  &:hover {
    background-color: ${theme.steel10};
  }

`

const HoverItem = styled(FlexBox)`
    .hover-icon{
      display: ${(props) => (props.isHovered ? 'block' : 'none')};
    }

`
