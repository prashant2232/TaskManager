
const socketIo = require("socket.io");

const startSocketServer = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    
    socket.emit("taskReminder", { message: "Your task is due!" });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = startSocketServer;
