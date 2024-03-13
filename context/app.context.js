import React, {createContext, useContext, useState} from 'react';
import AddToPlanModal from "@/components/modals/AddToPlanModal";

const AppContextProvider = ({ children }) => {

    const [yelpResults, setYelpResults] = useState([])
    const [location, setLocation] = useState(null);
    const [isSearching, setIsSearching] = useState(false)
    const [openCreatePlan, setOpenCreatePlan] = useState(false)
    const [openAddBuddy, setOpenAddBuddy] = useState(false)
    const [showAddToPlanModal, setShowAddToPlanModal] = useState(false)

    const closeAddToPlanModal = () => {
        setShowAddToPlanModal(false)
    }
    const openAddToPlanModal = () => {
        setShowAddToPlanModal(true)
    }

    const openAddBuddyModal = () => {
        setOpenAddBuddy(true)
    }

    const closeBuddyModal = () => {
        setOpenAddBuddy( false)
    }
    const openCreatePlanModal = () => {
        setOpenCreatePlan(true)
    }
    const closeCreatePlan = () => {
        setOpenCreatePlan(prev => !prev)
    }

    const settings = {
        yelpResults,
        setYelpResults,
        location,
        setLocation,
        isSearching,
        setIsSearching,
        openCreatePlan,
        closeCreatePlan,
        openCreatePlanModal,
        openAddBuddy,
        closeBuddyModal,
        openAddBuddyModal,
        openAddToPlanModal,
        closeAddToPlanModal,
        showAddToPlanModal
    };

    return <BaseContext.Provider value={settings}>
        {children}
        { showAddToPlanModal && <AddToPlanModal open={showAddToPlanModal} onClose={closeAddToPlanModal} />}

    </BaseContext.Provider>;
}

const BaseContext = createContext(null);


export const useAppContext = () => {
    return useContext(BaseContext)
}

export default AppContextProvider;
