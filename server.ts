import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import fastify from "fastify";

import { database } from "./src/database/client";
import { courses } from "./src/database/schema";
import { eq } from "drizzle-orm";

const server = fastify();

server.get("/", (request, reply) => {
  return reply.status(200).send();
});

server.get("/courses", async (request, reply) => {
  const result = await database
    .select({
      id: courses.id,
      title: courses.title,
      descriptiom: courses.description,
    })
    .from(courses);

  return reply.status(200).send({ courses: result });
});

server.get("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const courseId = params.id;

  const result = await database
    .select()
    .from(courses)
    .where(eq(courses.id, courseId));

  if (result.length > 0) {
    return reply.status(200).send({ course: result[0] });
  }

  return reply.status(404).send({ error: "course not found" });
});

server.post("/courses", async (request, reply) => {
  type RequestBody = {
    title: string;
    description?: string;
  };

  const requestBody = request.body as RequestBody;

  const courseTitle = requestBody.title;
  const courseDescription = requestBody.description;

  if (!courseTitle)
    return reply.status(400).send({ erro: "O título é obrigatório!" });

  const result = await database
    .insert(courses)
    .values({
      title: courseTitle,
      description: courseDescription,
    })
    .returning();

  return reply.status(201).send({ courseId: result[0].id });
});

server.listen({ port: 3333 }).then(() => {
  console.log("fastify server is running");
});
