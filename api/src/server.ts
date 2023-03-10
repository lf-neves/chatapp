import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import session from "express-session";
import { addUser } from "./users";

const app = express();
const httpServer = http.createServer(app);
httpServer.listen(8000);

const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
});

app.use(cors());
app.use(sessionMiddleware);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

//@ts-ignore
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

io.on("connection", (socket) => {
  addUser({ id: socket.id, name: "test", room: "1" });

  socket.on("sendMessage", (room, username, message, callback) => {
    console.log(
      `Received message: ${message} from ${username} to room: ${room}`
    );

    socket.join(room);
    io.to(room).emit("message", { user: username, text: message });
  });
});
