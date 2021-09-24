import express from "express";
import { createServer, Server } from "http";
import { initWebSocket } from "./middleware/socket";

const app = express();
const server: Server = createServer(app);

/*
Type here direct path
*/

initWebSocket(server);
server.listen(process.env.PORT || 5000, () => {
  console.log("server initialized");
});
