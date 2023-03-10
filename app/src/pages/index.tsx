import { io } from "socket.io-client";
import { Container } from "@chakra-ui/react";
import { ChatView } from "@/components/ChatView";

let socket;

export default function Home() {
  socket = io("http://localhost:8000");

  return (
    <Container p={10}>
      <ChatView socket={socket} />
    </Container>
  );
}
