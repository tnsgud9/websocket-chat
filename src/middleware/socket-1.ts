import express from "express";
import { createServer, Server } from "http";
import webSocket, { Socket } from "socket.io";
import { ChatEvent } from "./model/ChatEvent";
import { roomType } from "./types/Chat";

let io: webSocket.Server;

let roomList: Map<string, roomType> | undefined;

export const initWebSocket = (server: Server): void => {
  // 소켓 옵션
  io = new webSocket.Server(server, {
    path: "/socketchat",
    serveClient: false,
    allowEIO3: true,
    cors: { origin: true, credentials: true },
  });

  // 소켓 서버 접속시
  io.on(ChatEvent.CONNECTION, (socket: webSocket.Socket) => {
    // Manager to User에 해당된 소캣 채팅 초기화
    const userId = socket.handshake.query.user;
    socket.join(`${userId}`);
    if (roomList?.get(`${userId}`) === undefined) {
      roomList?.set(`${userId}`, {
        managerId: "test", // 이부분은 DB 연결시 따로 추가로 작업해야함.
        user: `userId`,
        messages: [],
      });
    }
    const room = roomList?.get(`${userId}`);
    io.to(`${userId}`).emit(ChatEvent.CHAT_HISTROY, room);

    socket.on(ChatEvent.NEW_MESSAGE, (message: string) => {
      console.log("New Message : ", message);
      const mes = {
        context: message,
        isImage: false,
        user: `${userId}`,
        date: "test date",
      };

      room?.messages.push(mes);

      io.to(`${userId}`).emit(ChatEvent.NEW_MESSAGE, mes);
    });

    //TODO: Join 되기 전 추가적으로 DB와 함꼐 조회해서
    //      해당 user가 있는지 검증해야함.

    // TODO: 위 해당 검증후 DB에 접속하여
    //       이전 기록에 대한 채팅 내용을 모두 전달 해줘야함.
  });
  io.on(ChatEvent.DISCONNECT, (socket: webSocket.Socket) => {
    console.log("DISCONNECT: ", socket.id);
  });
};
