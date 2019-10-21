/**
 * Step 3
 * TODO Change this configuration with the one provided during your registration
 * @type {{}}
 */
const CHANGEME = {
    clientId: 'change-me',
    deviceEUI: '13:37:00:00:FF:FF:FF:FF'
};

module.exports = {
    // BEGIN MQTT Client config
    mqtt: {
        host: 'mqtts://broker.save-lora.takima.io:8883',
        username: 'gotham',
        password: 'IAmTheGodOfGothamAndThisPasswordIsSeri0u$',
        clientId: CHANGEME.clientId
    },
    // END MQTT Client config
    // BEGIN SAVELORA Client config
    loRaServer: {
        baseUrl: 'https://api.save-lora.takima.io/api/proxy',
        authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDciLCJuYW1lIjoiVHJpbml0eSIsImlhdCI6MTU0NjI5NzIwMH0.lMVZyGRwiq0LK4INzYIQj0wST0qMsImXG-9-qg1j8CU',
        rak811DevProfileId: '1d99a006-e617-4fb3-9ffe-a71567ee36a7',
        loRaApplicationId: 1,
    },
    progressClient: {
        baseUrl: 'https://api.save-lora.takima.io/api/public',
        authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDEiLCJuYW1lIjoiUHVibGljIElkaW90IiwiaWF0IjoxNTQ2Mjk3MjAwfQ.zxlPEx7FzRwd5BclXEN2foAYXqzhUEPmmlNZJ4nk9u0'
    },
    // END SAVELORA Client config
    user: {
        appEUI: '42:42:42:42:42:42:42:42',
        mockAppEUI: '00:00:00:00:00:00:00:00',
        nwkKey: '42:42:42:42:42:42:42:42:42:42:42:42:42:42:42:42',
        deviceEUI: CHANGEME.deviceEUI,
        clientId: CHANGEME.clientId
    },
    logger:{
        level: 'info' // use 'verbose' for a better logging
    }
};
