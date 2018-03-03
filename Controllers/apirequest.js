const RequestClient = require("reqclient").RequestClient;

let retrieveMessageData = new RequestClient({
    "baseUrl": "https://api.ciscospark.com/v1/messages/",
    "headers": {"Authorization" : "Bearer NjEyYjlhZmUtOWRkMS00MjIyLWE4NjktZjM5OTIxZmYyZDE0NGYyMDQ0OWItODc5"}
})

let retrieveCurrencyPrice  = new RequestClient({
    "baseUrl": "https://api.binance.com/api/v3/ticker/"
})

let sendMessage = new RequestClient({
    "baseUrl": "https://api.ciscospark.com/v1/",
    "headers": {"Authorization" : "Bearer NjEyYjlhZmUtOWRkMS00MjIyLWE4NjktZjM5OTIxZmYyZDE0NGYyMDQ0OWItODc5"}
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
                    "roomId": currencySymbol.roomId,
                    "markdown": "The current price for " + currencyPair + " is " + currencyPrice.price
                })
            .catch(console.log)
        })
        .catch(console.log)
    })
    .catch(console.log)
}

const botMembershipAdd = trigger => {
    let roomId = trigger.data.roomId
    let roomMessage = `Hello Everyone, I am cryptoCurrencyBot. I am here in the background and will provide you the current price of a currency pair listed on the cryptocurrency exchange Binance. To ensure that I see your message please direct it @ me so that I know I am the one that should be responding to the message.\n\nFor now, I only accept one command and that is giving me a currency pair. For example if you are interested in the price of Ripple to Bitcoin then send me a message with XRPBTC or if you want the price returned in ethereum then send me a message with XRPETH.`
    sendMessage.post(
        "messages", {
            "roomId": roomId,
            "text": roomMessage
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
    GroupRoomResponse,
    botMembershipAdd
}