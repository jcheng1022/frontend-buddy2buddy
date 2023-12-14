import APIClient from '../services/api'
import {useQuery} from "react-query";
import {defaultQueryProps} from "@/hooks/index";

export const useAllTasks= (  props = {})  => {

    const queryKey = ['tasks', props];

    return useQuery(queryKey, () => APIClient.api.get('/tasks/me', { params: props}), {
        // enabled: !!userId,
        ...defaultQueryProps,
    });
};
// export const useTodaysTasks= (  props = {})  => {
//
//     const queryKey = ['tasks', 'today', props];
//
//     return useQuery(queryKey, () => APIClient.api.get('/tasks/today', { params: props}), {
//         // enabled: !!userId,
//         ...defaultQueryProps,
//     });
// };

export const useTasksByRange= ( range = 'today', props = {})  => {

    const queryKey = ['tasks', range, 'range'];

    return useQuery(queryKey, () => APIClient.api.get(`/tasks/range/${range}`, { params: props}), {
        // enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const useTaskById = ( taskId, props = {})  => {

    const queryKey = ['task', taskId,  props];

    return useQuery(queryKey, () => APIClient.api.get(`/tasks/${taskId}`, { params: props}), {
        enabled: !!taskId,
        ...defaultQueryProps,
    });
};
