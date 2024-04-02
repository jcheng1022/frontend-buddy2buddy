import {useQuery} from "react-query";
import APIClient from "@/services/api";
import {defaultQueryProps} from "@/hooks/index";

export const useSearchResults = ( name  ='', location='')  => {

    const queryKey = ['search', name, location];
    console.log(name, location, `search22423`)

    return useQuery(queryKey, () => APIClient.api.get(`/services/search`, { params: {
            name,
            location
        }}), {
        enabled: !!name && !!location,
        ...defaultQueryProps,
    });
};

