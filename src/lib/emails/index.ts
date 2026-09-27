// One import for every transactional email the landing site sends.
export type { EmailContent } from "./layout";
export { contactReceivedEmail, type ContactReceivedInput } from "./contact-received";
export { matchReceivedEmail, type MatchReceivedInput } from "./match-received";
