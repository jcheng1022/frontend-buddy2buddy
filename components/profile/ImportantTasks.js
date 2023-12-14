import styled from "styled-components";
import {useTasksByRange} from "@/hooks/tasks.hooks";
import ActionBuilder from "@/components/ActionBuilder";
import TaskListBuilder from "@/components/TaskListBuilder";
import {useState} from "react";
import {useAppContext} from "@/context/app.context";

const ImportantTasks = () => {
    const  {data: tasks} = useTasksByRange('important')
    const [selectedTasks, setSelectedTasks] = useState([])
    const {completeTasks, moveToTrash} = useAppContext();


    const handleUnselect = () => {
        setSelectedTasks([])
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

    return (
        <Container>
            <ActionBuilder arr={selectedTasks} buttons={btnConfig}/>

            <TaskListBuilder setSelectedList={setSelectedTasks} selectedList={selectedTasks} list={tasks}/>

        </Container>
    )
}

export default ImportantTasks;

const Container = styled.div``
