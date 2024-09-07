import type { Schema } from "../../data/resource"


export const handler: Schema["recommendationActivities"]["functionHandler"] = async (event) => {
    const {sessionId, inputText} = event.arguments
    console.log(sessionId)
    console.log(inputText)
    return JSON.stringify("{}")
}
