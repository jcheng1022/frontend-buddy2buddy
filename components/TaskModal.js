import styled from 'styled-components';
import {Button, Checkbox, DatePicker, Input, Modal, Select} from "antd/lib";
import {useAppContext} from "@/context/app.context";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {FlexBox, Gap} from "@/components/common";
import TextArea from "antd/lib/input/TextArea";
import APIClient from '../services/api'
import {useQueryClient} from "react-query";
import {theme} from "@/styles/themes";
import {Plus} from "react-feather";
import {useAllBatches} from "@/hooks/batches.hooks";
import {useRouter} from "next/router";

const TaskModal = () => {
    const {createNewTask, setCreateNewTask} = useAppContext();
    const [taskForm, setTaskForm] = useState({
        date: dayjs().format(),
        subtaskList: []
    })
    const router = useRouter()
    const {batch} = router.query;
    const [errors, setErrors] = useState({})
    const [newSubtaskIndex, setNewSubtaskIndex] = useState(null)
    const client = useQueryClient()
    const {data: batches} = useAllBatches();
    const batchOptions = batches?.map(batch => ({
        label: batch.name,
        value: batch.id
    }))
    batchOptions?.unshift({
        label: 'No Batch',
        value: null
    })

    useEffect(() => {
        if (batch && batchOptions?.find(o => o.value === batch)) {
            setTaskForm({
                ...taskForm,
                batchId: batch
            })
        }
    }, [batch, batches])

    useEffect(() => {
        if (newSubtaskIndex !== null) {
            const inputElement = document.getElementById(`subtask-input-${newSubtaskIndex - 2}`);
            if (inputElement) {
                inputElement.focus();
            }

            // Reset the newSubtaskIndex after focusing
            setNewSubtaskIndex(null);
        }
    }, [taskForm])

    const validateEntry = () => {

        const noEmptySubtask =() => {
            if (taskForm?.subtaskList.length === 0 ) {
                return true;
            }
            if ( (taskForm?.subtaskList?.length > 0) && !taskForm?.subtaskList?.every(task => task.text.length > 0)) {
                return false
            }
            return true
        }

        if (!noEmptySubtask()) {
            setErrors({
                ...errors,
                subtaskList: 'Subtasks cannot be empty, either remove or add a subtext name'
            })
            return false;

        }
        return true;
    }

    const onBatchSelect = (value) => {
        setTaskForm({
            ...taskForm,
            batchId: value
        })
    }
    const handleSubmit = async (e) => {

        const isValid = validateEntry();
        if (!isValid) {
            return;
        }


        await APIClient.api.post(`/tasks`, taskForm).then(() => {
            // client.refetchQueries(['tasks', 'today'])
            client.refetchQueries(['batch', batch])

            setTaskForm({
                date: dayjs().format(),
                subtaskList: [],
                batchId: batch ? batch : null
            })
            setCreateNewTask(false);
        })


    }
    const handleInputChange = (name) => (e) => {
        const value = typeof e === 'object' ? e.target.value : e

        setTaskForm({
            ...taskForm,
            [name]: value
        })
    }

    const addNewSubTask = () => {
        const current  = taskForm?.subtaskList;
        current.push({
            text: '',
            isComplete: false,
            priority: taskForm.subtaskList.length + 1
        })
        setTaskForm({
            ...taskForm,
            subtaskList: current
        })
        setNewSubtaskIndex(taskForm.subtaskList.length + 1)
    }

    const handleSubTaskChange = (index, isCheckbox=false) =>  (e) => {
        const updatedSubtaskList = [...taskForm.subtaskList];
        if(!isCheckbox) {
            updatedSubtaskList[index] = {
                ...updatedSubtaskList[index],
                text: e.target.value
            };
        } else {
            updatedSubtaskList[index] = {
                ...updatedSubtaskList[index],
                isComplete: e.target.checked
            };
        }

        setTaskForm({
            ...taskForm,
            subtaskList: updatedSubtaskList
        });
    }



    return (
        <Container open={createNewTask} onCancel={() => setCreateNewTask(false)}
                   footer={[
                       <Button key={`cancel-submission`}> Cancel</Button>,
                       <Button key={`submit-add-task`} onClick={handleSubmit} type={'primary'}> Add Task</Button>

                   ]}>
            {/* Your component content here */}
            <Gap gap={18}/>
            <FlexBox justify={'space-between'}>
                <div className={'modal-title'}> Task </div>
                <Select onChange={onBatchSelect} placeholder={'No Batch'} value={taskForm?.batchId} options={batchOptions} style={{width: 200}}/>
            </FlexBox>

            <div className={'input-label'}> Assign date</div>
            <DatePicker
                showTime={{format: 'HH:mm'}}
                format="YYYY-MM-DD HH:mm"
                // defaultValue={dayjs()}
                value={dayjs(taskForm?.date)}
                onChange={(date, dateString) =>
                    setTaskForm({
                        ...taskForm,
                        date: dayjs(date).format(),
                    })
                }
            />
            {errors?.date && <div className={'error-message'}> {errors.date} </div>}
            <Gap gap={10}/>

            <div className={'input-label'}> Name</div>
            <Input value={taskForm?.name} onChange={handleInputChange('name')} />
            {errors?.name && <div className={'error-message'}> {errors.name} </div>}

            <Gap gap={10}/>
            <div className={'input-label'}> Description</div>
            <TextArea value={taskForm?.description} onChange={handleInputChange('description')} />
            {errors?.description && <div className={'error-message'}> {errors.description} </div>}


            <Gap gap={10}/>
            <SubtaskList direction={'column'} align={'flex-task'}>

                <FlexBox>
                    <div className={'subtask-title'}> Subtasks</div>
                    <FlexBox justify={'flex-end'} gap={8} className={'add-section'} onClick={addNewSubTask}>
                        <Plus size={18}/>
                        <div className={'new-text'}> New</div>
                    </FlexBox>
                </FlexBox>
                <div className={'subtask-description'}> Break down this task even more!</div>


                {taskForm?.subtaskList?.map((subtask, index) => {
                    return (
                        <FlexBox key={`subtask-${index}`} direction={'row'} wrap={'no-wrap'}>
                            <Checkbox onChange={handleSubTaskChange(index, true)} checked={subtask?.isComplete}/>
                            <Input id={`subtask-input-${index}`} value={subtask.text}  placeholder={`Subtask #${index}`} bordered={false} onChange={handleSubTaskChange(index, false)}/>
                        </FlexBox>
                    )
                })}

            </SubtaskList>
            {errors?.subtaskList && <div className={'error-message'}> {errors.subtaskList} </div>}



        </Container>
    );
}

export default TaskModal;

const Container = styled(Modal)`
  
  .error-message { 
    font-size: 10px;
    color: red;
  }
  .input-label {
    font-size: 12px;
    font-weight: 500;
  }
  
  .modal-title {
    font-size: 18px;
    margin-bottom: 12px;
  }
`

const SubtaskList = styled(FlexBox)`
  .subtask-title {
    
  }
  
  .subtask-description {
    font-size: 12px;
    color: ${theme.steel40};
  }
  
  
  .new-text {
    font-size: 12px;
  }
  
  .add-section:hover {
    cursor: pointer;
    
  }
  
  
`
