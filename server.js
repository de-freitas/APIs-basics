const fastify = require("fastify");
const crypto = require("node:crypto");

const server = fastify();

const courses = [
  { id: "1", title: "curso de Node.Js" },
  { id: "2", title: "curso de React" },
  { id: "3", title: "curso de React Native" },
];

server.get("/", () => {
  return "get ok";
});

server.get("/courses", (request, reply) => {
  return reply.status(200).send({ courses });
});

server.get("/courses/:id", (request, reply) => {
  const courseId = request.params.id;

  const course = courses.find((course) => course.id == courseId);

  if (course) {
    return reply.send({ course });
  }

  return reply.status(404).send({ error: "course not found" });
});

server.post("/courses", (request, reply) => {
  const courseId = crypto.randomUUID();

  courses.push({ id: courseId, title: "novo curso" });

  return reply.status(201).send({ courseId: courseId });
});

server.listen({ port: 3333 }).then(() => {
  console.log("fastify server is running");
});
