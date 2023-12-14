import React, {createContext, useContext} from 'react';

const TaskContextProvider = ({ children }) => {
    // const {data: tasks} = useAllTasks();
    // const groupedTasks = useMemo(() => {
    //     return tasks?.reduce((grouped, task) => {
    //         const date = dayjs(task.date).format('YYYY-MM-DD');
    //
    //         if (!grouped[date]) {
    //             grouped[date] = [];
    //         }
    //
    //         grouped[date].push(task);
    //
    //         return grouped;
    //     }, {});
    // }, [tasks]);


    const settings = {
        // groupedTasks,
        // unsortedTasks: tasks
    };

    return <BaseContext.Provider value={settings}>{children}</BaseContext.Provider>;
}

const BaseContext = createContext(null);


export const useTaskContext = () => {
    return useContext(BaseContext)
}

export default TaskContextProvider;
