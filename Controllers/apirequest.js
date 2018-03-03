const RequestClient = require("reqclient").RequestClient;

const retrieveMessageData = new RequestClient({
    "baseUrl": "https://api.ciscospark.com/v1/messages/",
    "headers": {"Authorization" : "Bearer NThjMDczMDYtNjE5Yi00MTA4LWFlMjQtZTI0Yzc4NzQ3MDFmMWJlZDBkMzMtYzUy"}
})

const retrieveCurrencyPrice  = new RequestClient({
    "baseUrl": "https://api.binance.com/api/v3/ticker/"
})

const sendMessage = new RequestClient({
    "baseUrl": "https://api.ciscospark.com/v1/",
    "headers": {"Authorization" : "Bearer NThjMDczMDYtNjE5Yi00MTA4LWFlMjQtZTI0Yzc4NzQ3MDFmMWJlZDBkMzMtYzUy"}
})

const DirectRoomResponse = (trigger) => {
    retrieveMessageData.get(trigger.data.id)
    .then(currencySymbol => {
        retrieveCurrencyPrice.get({"uri":"price",
            "query": {
                "symbol": currencySymbol.text
            }
        })
        .then(currencyPrice => {
            sendMessage.post("messages", {
                "toPersonId": trigger.data.personId,
                "text": "The current price for " + currencySymbol.text + " is " + currencyPrice.price
            })
            .then(resp => {
                console.log(resp);
            })
            .catch(console.log);
        })
        .catch(console.log);
    })
    .catch(console.log);
}

const GroupRoomResponse = (trigger) => {
    retrieveMessageData.get(trigger.data.id)
    .then(msgData =>  {
        retrieveCurrencyPrice.get({"uri":"price",
            "query": {
                "symbol": resp.text.split(" ")[1]
            }
        .then(resp => {
            sendMessage.post("messages", {
                "roomId": msgData.roomId,
                "markdown": "Hello <@personEmail:" + msgData.personId + ">, the curret price for currencty pair " + msgData.text.split(" ")[1] + " is " + resp.price
            })
            .then(resp => {
                console.log(resp);
            })
            .catch(console.log);
        })
        .catch(console.log);
    })
    .catch(console.log)
}

    // retrieveMessageData.get(trigger.data.id)
    // .then(currencySymbol => {
    //     retrieveCurrencyPrice.get({"uri":"price",
    //         "query": {
    //             "symbol": currencySymbol.text
    //         }
    //     })
    //     .then(currencyPrice => {
    //         sendMessage.post("messages", {
    //             "toPersonId": trigger.data.personId,
    //             "text": "The current price for " + currencySymbol.text + " is " + currencyPrice.price
    //         })
    //         .then(resp => {
    //             console.log(resp);
    //         })
    //         .catch(console.log);
    //     })
    //     .catch(console.log);
    // })
    // .catch(console.log);

module.exports = {
    DirectRoomResponse,
    GroupRoomResponse
}