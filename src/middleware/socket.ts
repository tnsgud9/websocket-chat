import express from "express";
import { createServer, Server } from "http";
import webSocket, { Socket } from "socket.io";
import { ChatEvent } from "./ChatEvent";

let io: webSocket.Server;
export const initWebSocket = (server: Server): void => {
  io = new webSocket.Server(server, {
    path: "/socketchat",
    serveClient: false,
    allowEIO3: true,
    cors: { origin: true, credentials: true },
  });
  io.on(ChatEvent.CONNECTION, (socket: webSocket.Socket) => {
    console.log("conntected: ", socket.id);
    console.log(socket.handshake.query.param);
    socket.join("test");
  });
  io.on(ChatEvent.DISCONNECT, (socket: webSocket.Socket) => {
    console.log("DISCONNECT: ", socket.id);
  });
};
