import { Hono } from "hono";

//initialize
const app = new Hono();

//store memory for audit eveont history
type AuditEvent = {
    id: number;
    action: string;
    task: any;
    timestamp: string;
};

const  auditLogs: AuditEvent[] = [];  //memory data store array holding logged events.
let eventCounter = 1; //incrementing counter simulating database sequence generation.

//webhook listener
//Send by the notifications by the task service
app.post("/events", async (c) => {
    //web satandard
    //Read & parse incoming stream
    const body = await c.req.json();

    const newLog: AuditEvent = {  // Constructs the structured log entry
        id: eventCounter++, //Assigns the current counter and then increments it.
        action: body.action,
        task: body.task,
        timestamp: body.timestamp || new Date().toISOString(),
    };

    auditLogs.push(newLog); //Appends the event to the in-memory array.

    //Print audit alerts in the clg
    console.log(` [AUDIT LOG EVENT #${newLog.id}]`);
    console.log(`   Action:    ${newLog.action}`);
    console.log(`   Task ID:   ${newLog.task?.id} ("${newLog.task?.title}")`);
    console.log(`   Timestamp: ${newLog.timestamp}`);

    return c.json({ success: true, recordedEvent: newLog}, 201);
});


//View all the audit logs
// Synchronous route
app.get("/events", (c) => {
    return c.json({
        totalEvents: auditLogs.length,
        logs: auditLogs,
    });
});

//check the endpoint
app.get("/", (c) => c.text("Hono Audit Service is Live on Bun!"));

//start HOno on port 3002 on bun
export default {
    port: 3002,
    fetch: app.fetch,
};