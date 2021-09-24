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
    console.log(socket.handshake.query.user);
    const userId = socket.handshake.query.user;

    //TODO: Join 되기 전 추가적으로 DB와 함꼐 조회해서
    //      해당 user가 있는지 검증해야함.

    // TODO: 위 해당 검증후 DB에 접속하여
    //       이전 기록에 대한 채팅 내용을 모두 전달 해줘야함.
    socket.join(`${userId}`);
  });
  io.on(ChatEvent.DISCONNECT, (socket: webSocket.Socket) => {
    console.log("DISCONNECT: ", socket.id);
  });
};
