import React, {createContext, useContext, useState} from 'react';
import TaskModal from "@/components/TaskModal";
import WelcomeModal from "@/components/WelcomeModal";
import APIClient from '../services/api'
import {notification} from "antd/lib";
import {useQueryClient} from "react-query";
import {useSearchParams} from "next/navigation";
import FriendModal from "@/components/profile/FriendModal";

const AppContextProvider = ({ children }) => {
    const [createNewTask, setCreateNewTask] = useState(false)
    const [welcomeModal, setWelcomeModal] = useState(false)
    const [openFriendModal, setOpenFriendModal] = useState(false)
    const client = useQueryClient()
    const searchParams = useSearchParams();
    const selectedTab = searchParams.get('tab')

    const handleClickNewTask = () => {
        if (welcomeModal) {
            // close modal if open
            setWelcomeModal(false)
        }

        setCreateNewTask(true);
    }

    const completeTasks = (arr) => async () => {
        if (!arr || arr.length === 0) return;

        await APIClient.api.patch('/tasks/complete', arr)
    }
    const moveToTrash = (arr) => async () => {
        if (!arr || arr.length === 0) return;

        await APIClient.api.patch('/tasks/trash', arr).then(async () =>{
            await client.refetchQueries(['tasks', 'today']);
            await notification.success({message:'success', description:'Tasks have been moved to trash', duration:5})
        })
    }

    const restoreTasks = (arr) => async () => {
        if (!arr || arr.length === 0) return;

        await APIClient.api.patch('/tasks/restore', arr).then(async () =>{
            await notification.success({message:'success', description:'Tasks have been restored', duration:5})
        })
    }


    const settings = {
        selectedTab,
       createNewTask,
        setCreateNewTask,
        welcomeModal,
        setWelcomeModal,
        handleClickNewTask,
        completeTasks,
        moveToTrash,
        restoreTasks,
        openFriendModal,
        setOpenFriendModal
    };

    return <BaseContext.Provider value={settings}>{children}{createNewTask && <TaskModal/>} {openFriendModal && <FriendModal/> } <WelcomeModal /></BaseContext.Provider>;
}

const BaseContext = createContext(null);


export const useAppContext = () => {
    return useContext(BaseContext)
}

export default AppContextProvider;
