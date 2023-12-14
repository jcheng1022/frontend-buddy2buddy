import {useMutation, useQuery} from "react-query";
import APIClient from '../services/api'
import {defaultQueryProps} from "@/hooks/index";


export const useUserMenuData = (  props = {})  => {

    const queryKey = ['menu'];

    return useQuery(queryKey, () => APIClient.api.get(`/user/menu`, { params: props}), {
        // enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const useUserFriends = ( userId = null, type = 'ACCEPTED')  => {

    const queryKey = ['friends', userId, type];

    return useQuery(queryKey, () => APIClient.api.get(`/user/friends`, { params: {
        status: type
        }}), {
        enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const useFriendCounts = ( userId = null)  => {

    const queryKey = ['friends', userId, 'counts'];

    return useQuery(queryKey, () => APIClient.api.get(`/user/friends`, { params: {
            countsOnly: true
        }}), {
        enabled: !!userId,
        ...defaultQueryProps,
    });
};


