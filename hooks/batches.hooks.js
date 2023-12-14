import APIClient from '../services/api'
import {useQuery} from "react-query";
import {defaultQueryProps} from "@/hooks/index";

export const useAllBatches = ( range = 'today', props = {})  => {

    const queryKey = ['batches'];

    return useQuery(queryKey, () => APIClient.api.get(`/batches/`, { params: props}), {
        // enabled: !!userId,
        ...defaultQueryProps,
    });
};

export const useBatchById = ( batchId, props = {})  => {

    const queryKey = ['batch', batchId,  props];

    return useQuery(queryKey, () => APIClient.api.get(`/batches/${batchId}`, { params: props}), {
        enabled: !!batchId,
        ...defaultQueryProps,
    });
};
