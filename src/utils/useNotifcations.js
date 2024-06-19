import { useEffect } from "react";

function useNotifications() {
    useEffect(() => {
        if ("Notification" in window) { //check if notification api exists in user browser
            if (!Notification.permission === "granted") { //if permission not already grants
                Notification.requestPermission().then(function (permission) { //requests premisson then sends it
                    if (permission === "granted") {}
                });
            }
        }
    }, []);

    const sendNotifcation = (message) => { //makes a new Notification object with desired message
        if (Notification.permission === "granted") {
            new Notification(message);
        }
    };

    return { sendNotifcation };
}

export default useNotifications;