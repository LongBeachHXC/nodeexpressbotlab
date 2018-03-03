const RequestClient = require("reqclient").RequestClient;

let retrieveMessageData = new RequestClient({
    "baseUrl": "https://api.ciscospark.com/v1/messages/",
    "headers": {"Authorization" : "Bearer NThjMDczMDYtNjE5Yi00MTA4LWFlMjQtZTI0Yzc4NzQ3MDFmMWJlZDBkMzMtYzUy"}
})

let retrieveCurrencyPrice  = new RequestClient({
    "baseUrl": "https://api.binance.com/api/v3/ticker/"
})

let sendMessage = new RequestClient({
    "baseUrl": "https://api.ciscospark.com/v1/",
    "headers": {"Authorization" : "Bearer NThjMDczMDYtNjE5Yi00MTA4LWFlMjQtZTI0Yzc4NzQ3MDFmMWJlZDBkMzMtYzUy"}
})

const DirectRoomResponse = (trigger) => {
    retrieveMessageData.get(trigger.data.id)
    .then(currencySymbol => {
        retrieveCurrencyPrice.get({
            "uri":"price",
            "query": {
                "symbol": currencySymbol.text
            }
        })
        .then(currencyPrice => {
            sendMessage.post(
                "messages", {
                    "toPersonId": trigger.data.personId,
                    "text": "The current price for " + currencySymbol.text + " is " + currencyPrice.price
                })
            .catch(console.log);
        })
        .catch(console.log);
    })
    .catch(console.log);
}


const GroupRoomResponse = (trigger) => {
    let currencyPair = "";
    retrieveMessageData.get(trigger.data.id)
    .then(currencySymbol => {
        currencyPair = currencySymbol.text.split(" ")[1];
        retrieveCurrencyPrice.get({
            "uri": "price",
            "query": {
                "symbol": currencyPair
            }
        })
        .then(currencyPrice => {
            sendMessage.post(
                "messages", {
                    "roomId": currencySymbol.roomId
                    "markdown": "The current price for " + currencyPair " is " + currencyPrice.price
                })
            .catch(console.log)
        })
        .catch(console.log)
    })
    .catch(console.log)
}



//     retrieveMessageData.get(trigger.data.id)
//     .then(currencySymbol =>  {
//         currencyPair = currencySymbol.text.split(" ")[1]
//         retrieveCurrencyPrice.get({"uri":"price",
//             "query": {
//                 "symbol": currencyPair
//             }
//         .then(currencyPrice => {
//             sendMessage.post("messages", {
//                 "roomId": currencySymbol.roomId,
//                 "markdown": "Hello <@personEmail:" + currencySymbol.personEmail + ">, the curret price for currencty pair " + currencyPair + " is " + currencyPrice.price
//             })
//             .then(resp => {
//                 console.log(resp)
//             })
//             .catch(console.log)
//         })
//         .catch(console.log)
//     })
//     .catch(console.log)
// })
// .catch(console.log)
// }


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