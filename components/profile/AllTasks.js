import styled from "styled-components";
import {useTasksByRange} from "@/hooks/tasks.hooks";
import ActionBuilder from "@/components/ActionBuilder";
import {useAppContext} from "@/context/app.context";
import TaskListBuilder from "@/components/TaskListBuilder";
import {useState} from "react";

const AllTasks = () => {
    const {data: tasks} = useTasksByRange('all')
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
            <ActionBuilder arr={selectedTasks} buttons={btnConfig} />
            <TaskListBuilder list={tasks} selectedList={selectedTasks} setSelectedList={setSelectedTasks} />

        </Container>
    )
}

export default AllTasks;

const Container = styled.div``
