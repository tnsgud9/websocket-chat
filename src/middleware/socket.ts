import express from "express";
import { createServer, Server } from "http";
import webSocket, { Socket } from "socket.io";
import { ChatEvent } from "./model/ChatEvent";
import { ChatHistoryType, roomType } from "./types/Chat";

let io: webSocket.Server;
let rooms: Map<string, roomType> | undefined;

export const initWebSocket = (server: Server): void => {
  // 소켓 옵션
  io = new webSocket.Server(server, {
    path: "/socketchat",
    serveClient: false,
    allowEIO3: true,
    cors: { origin: true, credentials: true },
  });

  io.on(ChatEvent.CONNECTION, (socket: webSocket.Socket) => {
    // Manager to User에 해당된 소캣 채팅 초기화
    const userName = socket.handshake.query.user as string;
    const managerName = socket.handshake.query.manager as string;
    const roomName = socket.handshake.query.room as string;
        
    if (rooms?.get(roomName) === undefined) {
      rooms?.set(roomName, {
        managerId: managerName, 
        user: userName,
        messages: [],  // 이부분은 DB 연결시 따로 추가로 작업해야함.
      });
    }
    socket.join(roomName);
    const room = rooms?.get(roomName);
    

    socket.on(ChatEvent.CHAT_HISTROY, () => {
        const currentDate = new Date();
        const perviousDate = Object.assign(currentDate) as Date; 
        perviousDate.setMonth(-1);
        // 이부분은 DB 연결시 따로 추가로 작업해야함.
        socket.emit(ChatEvent.CHAT_HISTROY,{
            manager: managerName,
            user: userName,
            messages: room?.messages,
            startDate: currentDate.toString(),
            endDate: perviousDate.toString(),
        } as ChatHistoryType);
    });

    io.to(roomName).emit(ChatEvent.CHAT_HISTROY, room);


    socket.on(ChatEvent.SEND_MESSAGE, (message: string) => {
      console.log("New Message : ", message);
      const mes = {
        context: message,
        isImage: false,
        user: ,
        date: new Date(),
      };

      room?.messages.push(mes);
      // 이부분은 DB 연결시 따로 추가로 작업해야함.

      io.to(`${roomName}`).emit(ChatEvent.NEW_MESSAGE, mes);
    });
};
