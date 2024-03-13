import {useQuery} from "react-query";
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

    return useQuery(queryKey, () => APIClient.api.get(`/user/buddies`, { params: {
        status: type
        }}), {
        enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const useUserProfile = ( userId = null)  => {

    const queryKey = ['profile', userId];

    return useQuery(queryKey, () => APIClient.api.get(`/user/profile`, { }), {
        enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const useUserNotifications = ( userId = null)  => {

    const queryKey = ['notifications', userId];

    return useQuery(queryKey, () => APIClient.api.get(`/user/notifications`, {
        // params: props
    }), {
        enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const useUserBuddies = ( userId = null)  => {

    const queryKey = ['buddies', userId];

    return useQuery(queryKey, () => APIClient.api.get(`/user/buddies`, { }), {
        enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const usePlanById = ( planId = null)  => {

    const queryKey = ['plan', planId];

    return useQuery(queryKey, () => APIClient.api.get(`/planner/plan/${planId}`, { }), {
        enabled: !!planId,
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


