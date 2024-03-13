import React, {createContext, useContext, useState} from 'react';

const PlannerContext = ({ children }) => {
    const [options, setOptions] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [planningForm, setPlanningForm] = useState({
        categories: [],
        locations: [
            {
                index: 1,
                address: ''
            },
            // {
            //     index: 2,
            //     address: ''
            // },
        ]
    })
    const [results, setResults] = useState(null)


    const settings = {
       options,
        setOptions,
        planningForm,
        setPlanningForm,
        isLoading,
        setIsLoading,
        results,
        setResults

    };

    return <BaseContext.Provider value={settings}>
        {children}

    </BaseContext.Provider>;
}

const BaseContext = createContext(null);


export const usePlannerContext = () => {
    return useContext(BaseContext)
}

export default PlannerContext;
