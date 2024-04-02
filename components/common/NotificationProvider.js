import {useAuthContext} from "@/context/auth.context";
import {useEffect} from "react";
import {notification} from "antd/lib";
import {useQueryClient} from "react-query";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

const NotificationProvider = ({children}) => {
    const { user} = useAuthContext();
    const client = useQueryClient();

    useEffect(() => {
        if (!!user?.id) {
            const channelName = `user-${user?.id}`;
            const channel = pusher.subscribe(channelName);

            channel.bind('notification', data => {
                console.log(`updating`, data)

                client.refetchQueries(['notifications', user?.id]).then(() => {
                    notification.open({
                        message: 'You received a new notification',
                        // description: data.message,
                    });
                })
                if (data?.message === 'buddy-request') {
                    client.refetchQueries(['friends', user?.id])
                }
                if (data?.message === 'profile-update') {
                    client.refetchQueries(['profile', user?.id])
                }


                // setUserNotifications([...notifications, data]);
            });

            return () => {
                pusher.unsubscribe(channelName);
            };
        }

    }, [user]);


    return (
        <>

            {children}

        </>
    )
}

export default NotificationProvider;
