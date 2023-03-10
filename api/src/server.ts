import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import session from "express-session";

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
  socket.on("sendMessage", (message, callback) => {
    socket.emit("message", { user: socket.id, text: message });
  });
});
