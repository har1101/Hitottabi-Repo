import type { Schema } from "../../data/resource"
import { executeAgent } from "../common";


const AGENT_ID: string = "0YPTLEN7Y2"
const AGENT_ALIAS_ID: string = "PJQ80WZBZX"

export const handler: Schema["recommendationActivities"]["functionHandler"] =
    async (event) => executeAgent(event, AGENT_ID, AGENT_ALIAS_ID)

