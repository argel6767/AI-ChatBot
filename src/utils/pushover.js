export async function sendPushNotifications(message, title = "New Message", priority = 1) {
    //keys
    const userKey = import.meta.env.VITE_PUSHOVER_USER_KEY;
    const apiKey = import.meta.env.VITE_PUSHOVER_API_TOKEN;

    //POST request for PUSHOVER API
    const repsonse = await fetch("https://api.pushover.net/1/messages.json", {
        method:"POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body: new URLSearchParams({
            token: apiKey,
            user: userKey,
            message: message,
            title: title,
            priority: priority
        })
    });
   
    return await repsonse.json();
}