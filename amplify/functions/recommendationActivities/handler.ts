import type { Schema } from "../../data/resource"
import { executeAgent } from "../common";


const AGENT_ID: string = "VABTFZ2AIW"
const AGENT_ALIAS_ID: string = "Y8GIUCEX0Q"

export const handler: Schema["recommendationActivities"]["functionHandler"] =
    async (event) => executeAgent(event, AGENT_ID, AGENT_ALIAS_ID)

