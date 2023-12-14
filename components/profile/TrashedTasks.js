import styled from "styled-components";
import {useTasksByRange} from "@/hooks/tasks.hooks";
import {useState} from "react";
import {useAppContext} from "@/context/app.context";
import ActionBuilder from "@/components/ActionBuilder";
import TaskListBuilder from "@/components/TaskListBuilder";

const TrashedTasks = () => {
    const {data: tasks} = useTasksByRange('trashed')
    const [selectedTasks, setSelectedTasks] = useState([])
    const {restoreTasks} = useAppContext();
    const handleSelectTask = (taskId) => {
        const isTaskSelected = selectedTasks.includes(taskId);

        if (isTaskSelected) {
            setSelectedTasks((prevSelectedTasks) => prevSelectedTasks.filter((id) => id !== taskId));
        } else {
            setSelectedTasks((prevSelectedTasks) => [...prevSelectedTasks, taskId]);
        }
    }

    const handleUnselect = () => {
        setSelectedTasks([])
    }

    const btnConfig = [
        {
            onClick:  restoreTasks(selectedTasks),
            className: 'btn restore-btn',
            label: `Restore ${selectedTasks.length} tasks`
        },
        // {
        //     onClick: moveToTrash(selectedTasks),
        //     className: 'btn delete-btn',
        //     label: `Delete ${selectedTasks.length} tasks`
        // },
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

export default TrashedTasks;

const Container = styled.div``
