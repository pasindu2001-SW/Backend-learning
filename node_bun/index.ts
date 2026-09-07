//CLI tool in TypeScript that fetches data, validates with Zod, and parses the output.

import { z } from "zod"; //zod runs at run time

//Zod
const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
});

//z.infer automatically extracts the TypeScript type directly from UserSchema.
type User = z.infer<typeof UserSchema>;

//non-blocking I/0 // fetch promise
async function fetchUserData() {
    try {
        console.log("fetching data from the Book..");

        const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

        const rawData = await response.json();

        //Strict Null crashes
        //if the formate is in correct, parse() immediately throws a ZodError
        const validatedUser = UserSchema.parse(rawData);

        console.log("Success! The data is safe and valid:");
        console.log(`Name: ${validatedUser.name}, Email: ${validatedUser.email}`);

    } catch (error) {
        console.error("Something went wrong:", error);
    }
}

//excute the function
fetchUserData();

