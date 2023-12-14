import React, {createContext, useContext, useEffect, useState} from 'react';
import {supabase} from '@/services/supabase';
import {Modal, notification} from 'antd/lib';
import {useRouter} from "next/router";
import APIClient from "@/services/api";
import FinishProfile from "@/components/FinishProfile";


const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [finishProfile, setFinishProfile] = useState(false)
    const router = useRouter();


    useEffect(() => {
        if (user) {
            if (!user.username || !user.firstName || !user.lastName) {
                setFinishProfile(true)
            }
        }
    }, [user])


    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                try {
                    const res = await APIClient.api.get('/user/me')

                    if (res){
                        setUser(res);

                    }
                } catch(e) {

                        notification.error({
                            message: 'Error with authentication',
                            description: e.message,
                            duration: 5
                        })



                }
            }
        })
    }, [])


    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {

            if (session) {
                try {
                    const res = await APIClient.api.get('/user/me')
                    if (res){
                        setUser(res);


                    }
                } catch(e) {
                        setUser(null)



                }
            } else {
                setUser(null)
            }

        });

    }, []);




    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        // setUser(null);
        if ( error) {
            notification.error({
                message: 'Failed',
                description: error.message,
                duration: 5
            })
        }

        setUser(null)
        await Modal.destroyAll();
        await router.push(`/`)

    }
    const settings = {
        user,
        signOut,
        finishProfile,
        setFinishProfile,
        setUser
    };

    return <BaseContext.Provider value={settings}>{children}<FinishProfile/></BaseContext.Provider>;
}

const BaseContext = createContext(null);


export const useAuthContext = () => {
    return useContext(BaseContext)
}

export default AuthContextProvider;
