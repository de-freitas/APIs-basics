import fastify from "fastify";
import crypto from "node:crypto";

const server = fastify();

const courses = [
  { id: "1", title: "curso de Node.Js" },
  { id: "2", title: "curso de React" },
  { id: "3", title: "curso de React Native" },
];

server.get("/", (request, reply) => {
  return reply.status(200).send();
});

server.get("/courses", (request, reply) => {
  return reply.status(200).send({ courses });
});

server.get("/courses/:id", (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;

  const courseId = params.id;

  const course = courses.find((course) => course.id == courseId);

  if (course) {
    return reply.send({ course });
  }

  return reply.status(404).send({ error: "course not found" });
});

server.post("/courses", (request, reply) => {
  type RequestBody = {
    title: string;
  };

  const requestBody = request.body as RequestBody;

  const courseId = crypto.randomUUID();
  const courseTitle = requestBody.title;

  if (!courseTitle)
    return reply.status(400).send({ erro: "O título é obrigatório!" });

  courses.push({ id: courseId, title: courseTitle });

  return reply.status(201).send({ courseId, courseTitle });
});

server.listen({ port: 3333 }).then(() => {
  console.log("fastify server is running");
});
