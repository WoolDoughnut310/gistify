import { getVerificationCode, pollAuthorization } from "../oauth.js";

chrome.runtime.onMessage.addListener(async ({ type }) => {
    switch (type) {
        case "AUTH_REQUEST":
            const verification = await getVerificationCode();

            console.log("Open %s", verification.verification_uri);
            console.log("Enter code: %s", verification.user_code);

            // Sends code to display to browser
            chrome.runtime.sendMessage({
                type: "AUTH_RESPONSE",
                payload: {
                    code: verification.user_code,
                    uri: verification.verification_uri,
                },
            });

            // Waits for user authorization
            const accessToken = await pollAuthorization(
                verification.device_code,
                verification.interval
            );

            console.log("Authorized Auto Gistify");

            chrome.storage.sync.set({
                accessToken,
            });
    }
});
