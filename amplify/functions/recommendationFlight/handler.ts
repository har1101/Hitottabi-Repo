import type { Schema } from "../../data/resource"


export const handler: Schema["recommendationsFlight"]["functionHandler"] = async (event) => {
    const {sessionId, inputText} = event.arguments
    console.log(sessionId)
    console.log(inputText)
    return JSON.stringify("{}")
}
