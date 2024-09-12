import type { Schema } from "../../data/resource"
import { executeAgent } from "../common";


const AGENT_ID: string = "VSYEMQJB8Y"
const AGENT_ALIAS_ID: string = "M0A1GPMBCL"

export const handler: Schema["recommendationsFlight"]["functionHandler"] =
    async (event) => executeAgent(event, AGENT_ID, AGENT_ALIAS_ID)
