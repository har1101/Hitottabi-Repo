import type { Schema } from "../../data/resource"
import { executeAgent } from "../common";


const AGENT_ID: string = "H4ORC1CXW6"
const AGENT_ALIAS_ID: string = "AB372R0AZS"

export const handler: Schema["recommendationHotels"]["functionHandler"] =
    async (event) => executeAgent(event, AGENT_ID, AGENT_ALIAS_ID)
