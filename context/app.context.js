import React, {createContext, useContext, useEffect, useState} from 'react';
import AddToPlanModal from "@/components/modals/AddToPlanModal";
import LoginPromptModal from "@/components/modals/LoginPromptModal";
import Storage from "@/services/storage";
import {useAuthContext} from "@/context/auth.context";


const AppContextProvider = ({ children }) => {

    const [yelpResults, setYelpResults] = useState([])
    const [location, setLocation] = useState(null);
    const [isSearching, setIsSearching] = useState(false)
    const [openCreatePlan, setOpenCreatePlan] = useState(false)
    const [openAddBuddy, setOpenAddBuddy] = useState(false)
    const [showAddToPlanModal, setShowAddToPlanModal] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuthContext();
    const LOCATION_STORAGE_KEY = `${user?.id}@location`



    const [fetchingLocation, setFetchingLocation] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if ('geolocation' in navigator && !!user) {
                setFetchingLocation(true)
                navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                    const { latitude, longitude } = coords;

                    const coordinates = Storage.getItem(LOCATION_STORAGE_KEY)

                    if (!coordinates) {
                        Storage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
                            latitude: latitude,
                            longitude: longitude,
                            zip: ''
                        }))
                    }
                    if (latitude.toFixed(3) === coordinates?.latitude.toFixed(3) && longitude.toFixed(3) === coordinates?.longitude.toFixed(3)) {

                        if (!!coordinates?.zip) {

                            setLocation(coordinates?.zip)

                            setFetchingLocation(false)
                            return;
                        }

                    } else {
                        Storage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
                            latitude: latitude,
                            longitude: longitude,
                            zip: ''
                        }))
                    }

                    const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;

                    try {
                        // Make the API request
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        const zip = data.features[0].properties.postcode

                        // check if new zip code

                        if (coordinates?.zip?.toString() !== zip) {
                            const updated = Storage.getItem(LOCATION_STORAGE_KEY)
                            Storage.setItem(LOCATION_STORAGE_KEY, {
                                ...updated,
                                zip: zip
                            })

                            setLocation(zip);

                            setFetchingLocation(false)

                        }



                    } catch (error) {
                        if (fetchingLocation){
                            setFetchingLocation(false)
                        }
                        console.error('Error fetching reverse geocoding data:', error);
                    }
                });
            }
        };

        fetchData();



    }, [user]);

    const closeLoginModal = () => {
        setShowLoginModal(false)
    }
    const openLoginModal = () => {
        setShowLoginModal(true)
    }
    const closeAddToPlanModal = () => {
        setShowAddToPlanModal(null)
    }
    const openAddToPlanModal = (business) => () => {
        console.log(`bussss`, business)
        setShowAddToPlanModal(business)
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
        showAddToPlanModal,
        setShowAddToPlanModal,
        openLoginModal,
    };

    return <BaseContext.Provider value={settings}>
        {children}
        { showAddToPlanModal && <AddToPlanModal business={showAddToPlanModal} onClose={closeAddToPlanModal} />}
        { showLoginModal && <LoginPromptModal open={showLoginModal} onClose={closeLoginModal} />}
    </BaseContext.Provider>;
}

const BaseContext = createContext(null);


export const useAppContext = () => {
    return useContext(BaseContext)
}

export default AppContextProvider;
