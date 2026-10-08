import { View, Text, AppState, AppStateStatus } from 'react-native'
import React, { useEffect } from 'react'
import { userStore } from '../store/userStore';
import SocketService from '../services/socket.service';

type Props = {
    children: React.ReactNode;
}

const SocketManager: React.FC<Props> = ({ children }) => {
    const user = userStore(s => s.user);

    useEffect(() => {

        if (user) {
            // connect
            SocketService.connect();
        } else {
            // disconnect
            SocketService.disconnect();
        }

        const handleAppStateSchange = (nextAppState: AppStateStatus) => {
            if (user && nextAppState === 'active') {
                SocketService.connect();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateSchange);

        return () => {
            subscription.remove();
            SocketService.disconnect();
        };

    }, [user]);


  return <>{children}</>
}

export default SocketManager