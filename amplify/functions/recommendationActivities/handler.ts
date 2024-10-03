import type { Schema } from "../../data/resource"
import { executeAgent } from "../common";


const AGENT_ID: string = "XSNKJMLVFU"
const AGENT_ALIAS_ID: string = "WL5HOZSFNL"

export const handler: Schema["recommendationActivities"]["functionHandler"] =
    async (event) => executeAgent(event, AGENT_ID, AGENT_ALIAS_ID)

