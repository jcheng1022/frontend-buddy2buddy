import APIClient from '../services/api'
import {useQuery} from "react-query";
import {defaultQueryProps} from "@/hooks/index";

export const useUserInterests = ( userId,  props = {})  => {

    const queryKey = ['interests', userId, props];

    return useQuery(queryKey, () => APIClient.api.get('/yelp/interest', { params: props}), {
        enabled: !!userId ,
        ...defaultQueryProps,
    });
};
