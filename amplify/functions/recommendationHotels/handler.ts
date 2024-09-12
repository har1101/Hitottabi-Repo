import type { Schema } from "../../data/resource"
import { executeAgent } from "../common";


const AGENT_ID: string = "SWCZNNZSD1"
const AGENT_ALIAS_ID: string = "TVSA9DCP1S"

export const handler: Schema["recommendationHotels"]["functionHandler"] =
    async (event) => executeAgent(event, AGENT_ID, AGENT_ALIAS_ID)
