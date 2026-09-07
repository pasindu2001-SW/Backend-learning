import { describe, test, expect } from "bun:test";

const TASK_API = "http://localhost:3001";
const AUDIT_API = "http://localhost:3002";

describe("Task sevrice and Audit log", () => {
    let createdTaskId: number;

    //create task in fastify
    test("1. Should be correctly created", async () => {
        const response = await fetch(`${TASK_API}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ title: "Automated Test Task"}),
        });

        expect(response.status).toBe(201);

        const task = await response.json();
        expect(task.id).toBeDefined();
        expect(task.title).toBe("Automated Test Task");
        expect(task.status).toBe("TODO");

        //save Id for next tests
        createdTaskId = task.id;
    });

    //Get all
    test("2. Should get all tasks as a list", async () => {
        const response = await fetch(`${TASK_API}/tasks`);
        expect(response.status).toBe(200);

        const allTasks = await response.json();
        expect(Array.isArray(allTasks)).toBe(true); // Verifies it is an array!
        
        // Finds the created task inside the list:
        const found = allTasks.find((t: any) => t.id === createdTaskId);
        expect(found).toBeDefined();
        expect(found.title).toBe("Automated Test Task");
    });

    //GEt by id
    test("3.Should get the task by Id", async () => {
        const response = await fetch(`${TASK_API}/tasks/${createdTaskId}`);
        expect(response.status).toBe(200);

        const task = await response.json();
        expect(task.id).toBe(createdTaskId);
        expect(task.title).toBe("Automated Test Task");
    });

    //Update
    test("4. should delete the task", async () => {
        const response = await fetch(`${TASK_API}/tasks/${createdTaskId}`, {
            method: "DELETE",
        });

        expect(response.status).toBe(200);

        //verify if it worng should return 404
        const checkResponse = await fetch(`${TASK_API}/tasks/${createdTaskId}`);
        expect(checkResponse.status).toBe(404);
    });

    //TEST Hono get audit events
    test("5. SHould verify Hono get the audit events", async () => {
        const response = await fetch(`${AUDIT_API}/events`);
        expect(response.status).toBe(200)

        const data = await response.json();
        expect(data.totalEvents).toBeGreaterThan(0);
    });
});
