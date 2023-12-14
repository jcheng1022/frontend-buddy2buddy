import styled from "styled-components";
import {useTasksByRange} from "@/hooks/tasks.hooks";
import {useEffect, useMemo, useState} from "react";
import {FlexBox} from "@/components/common";
import {theme} from "@/styles/themes";
import {useAppContext} from "@/context/app.context";
import ActionBuilder from "@/components/ActionBuilder";
import TaskListBuilder from "@/components/TaskListBuilder";
import {supabase} from "@/services/supabase";
import {useQueryClient} from "react-query";

const TodayTasks = () => {
    const client= useQueryClient();
    const {data: tasks} = useTasksByRange('today')
    const [selectedTasks, setSelectedTasks] = useState([])
    const {completeTasks, moveToTrash, setWelcomeModal, setCreateNewTask} = useAppContext();

    useEffect(() => {
        if (tasks?.length === 0) {
            setWelcomeModal(true)
        }
    }, [tasks])
    const sortedTasks = useMemo(() => {
        return tasks?.sort((a, b) => (a.isImportant === b.isImportant) ? 0 : a.isImportant ? -1 : 1);
    }, [tasks]);




   useEffect(() => {
      const channel = supabase
           .channel('task updates')
           .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {

               client.refetchQueries(['tasks','today', 'range'])
           })
           .subscribe()

       return () => supabase.removeChannel(channel)

   }, [supabase])

    const handleUnselect = () => {
        setSelectedTasks([])
    }
    const handleSelectTask = (taskId) => {
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
    return (
        <Container>
            {tasks?.length > 0 && <ActionBuilder arr={selectedTasks} buttons={btnConfig} />}
            <TaskListBuilder list={sortedTasks} selectedList={selectedTasks} setSelectedList={setSelectedTasks} />

        </Container>
    )
}

export default TodayTasks;

const Container = styled.div`
  
    margin: 24px 0px;
`

const TaskItem = styled(FlexBox)`
  padding: 12px;
  margin: 8px 0px;
    background-color: ${theme.ashGrey};
  border-radius: 12px;
  height: 100px;
  .tag-text {
    color: #D62246;
    font-weight: 500;
  }
`

const ActionSection = styled(FlexBox)`
    
  .btn {
    border: none;
    font-weight: 600;
  }

    .complete-btn {
      background-color:#96E6B3;
      
    }
  
  .important-btn{
    background-color: #F3DFA2;
  }
  
  .delete-btn{
    background-color: #df2935;
  }
  
  .unselect-btn{
    background-color: #FBFEF9;
  }
`
