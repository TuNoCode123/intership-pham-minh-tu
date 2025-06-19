import express from "express";
const app = express();
import cookieParser from "cookie-parser";

import { createServer } from "http";
import { Server } from "socket.io";

app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5174",
      "https://test27613872168736.myshopify.com",
      "https://torture-mines-documented-jersey.trycloudflare.com",
      "https://shopoftu2.myshopify.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const listUsers = [] as {
  userId: string;
  socketId: string;
}[];
const listAdmins = [] as {
  shopId: string;
  socketId: string;
}[];
const listUsersEmbed = [] as {
  userId: string;
  socketId: string;
}[];
const listUserBlock = [] as {
  userId: string;
  socketId: string;
}[];
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("client-message", (data) => {
    console.log("Received from client:", data);
    socket.emit("server-message", "Hello from server11111!");
  });
  socket.on("userOnline", (data) => {
    console.log("userOnline", data);
    if (data) {
      const isExistedUser = listUsers.findIndex((item) => item.userId == data);
      if (isExistedUser < 0) {
        listUsers.push({
          userId: data,
          socketId: socket.id,
        });
      } else {
        listUsers[isExistedUser].socketId = socket.id;
      }
    }

    // socket.emit("listUserOnline", listUsers);
  });
  socket.on("userOnlineEmbed", (data) => {
    if (data) {
      const isExistedUser = listUsersEmbed.findIndex(
        (item) => item.userId == data
      );
      if (isExistedUser < 0) {
        listUsersEmbed.push({
          userId: data,
          socketId: socket.id,
        });
      } else {
        listUsersEmbed[isExistedUser].socketId = socket.id;
      }
    }
  });
  socket.on("userOnlineBlock", (data) => {
    if (data) {
      const isExistedUser = listUserBlock.findIndex(
        (item) => item.userId == data
      );
      if (isExistedUser < 0) {
        listUserBlock.push({
          userId: data,
          socketId: socket.id,
        });
      } else {
        listUserBlock[isExistedUser].socketId = socket.id;
      }
    }
    socket.emit("listUserOnline", listUserBlock);
  });
  socket.on("adminOnline", (data) => {
    console.log("adminOnline", data);
    if (data) {
      const listArr = data.split("-");
      const shopId = listArr[1];

      const isExistedUser = listAdmins.findIndex(
        (item) => item.shopId == shopId
      );
      if (isExistedUser < 0) {
        listAdmins.push({
          shopId,
          socketId: socket.id,
        });
      } else {
        listAdmins[isExistedUser].socketId = socket.id;
      }
    }
  });
  socket.on("approvedReview", (data) => {
    const { customerId, state } = data;

    const isUserOnline = listUserBlock.find(
      (item) => `gid://shopify/Customer/${item.userId}` == customerId
    );
    if (isUserOnline) {
      socket.to(isUserOnline.socketId).emit("adminApprovedReview", state);
    }
  });
  socket.on("couponExpired", (data) => {
    const { customerId, codeId } = data;

    const isUserOnline = listUsersEmbed.find(
      (item) => `gid://shopify/Customer/${item.userId}` == customerId
    );
    if (isUserOnline) {
      socket.to(isUserOnline.socketId).emit("expiredCoupon", codeId);
    }
    console.log("couponExpired", data);
  });
  socket.on("userOffline", (data) => {
    console.log("userOffline", data);
    if (data) {
      const cloneEmbed = JSON.parse(JSON.stringify(listUsersEmbed)) as {
        userId: string;
        socketId: string;
      }[];
      const cloneBlock = JSON.parse(JSON.stringify(listUserBlock)) as {
        userId: string;
        socketId: string;
      }[];
      if (cloneEmbed.length > 0 && cloneBlock.length > 0) {
        const newEmbed = cloneEmbed.filter((item) => item.userId != data);
        const newBlock = cloneBlock.filter((item) => item.userId != data);
        listUsersEmbed.splice(0, listUsersEmbed.length, ...newEmbed);
        listUserBlock.splice(0, listUserBlock.length, ...newBlock);
        console.log("listUsersEmbed", listUsersEmbed);
        console.log("listUserBlock", listUserBlock);
        socket.emit("listUserOnline", listUserBlock);
      }
    }
  });
  socket.on("queueDone", (data) => {
    console.log("queueDone", data);
    if (data) {
      const listArr = data.split("-");
      const shopId = listArr[1];
      const checkAdmin = listAdmins.find((item) => item.shopId == shopId);
      if (checkAdmin) {
        socket
          .to(checkAdmin.socketId)
          .emit("allQueueDone", "SYNC DATA FINISHED SUCCESSFULLY");
      }
    }
    console.log("queueDone111111", data);
  });
});
const port = 8080;

httpServer.listen(port, () => {
  console.log(`The application is listening on port ${port}!`);
});
