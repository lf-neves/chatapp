import { Button, Container, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { io } from "socket.io-client";

let socket;

const JoinPage: React.FC = () => {
  socket = io("http://localhost:8000");

  const [name, setName] = useState("");
  const [room, setRoom] = useState("general");
  const route = useRouter();

  return (
    <Container>
      <Text mt={20} mb={10} fontSize={40} fontWeight={700}>
        Let's join the chat app
      </Text>
      <Input
        placeholder="Type the name you want to use in the chat"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        mt={5}
        placeholder="Type the room you want to use in the chat"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <Button
        colorScheme={"blue"}
        mt={5}
        onClick={() => {
          socket.emit("register_user", name);
          route.push(`/?name=${name}&room=${room}`);
        }}
      >
        Join
      </Button>
    </Container>
  );
};

export default JoinPage;
