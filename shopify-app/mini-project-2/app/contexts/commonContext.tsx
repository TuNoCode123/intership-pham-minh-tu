import { getSocket } from "app/helpers/socket";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface CommonContextType {
  socket: Socket | undefined;
  setSocket: (socket: Socket | undefined) => void;
}
export const CommonText = createContext<CommonContextType | undefined>(
  undefined,
);

export const CommonProvider = ({
  children,
  shopId,
}: {
  children: ReactNode;
  shopId: any;
}) => {
  const [socket, setSocket] = useState<Socket | undefined>();
  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    socket.on("connect", () => {
      setSocket(socket);
      socket.emit("adminOnline", `admin-${shopId}`);
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return (
    <CommonText.Provider value={{ setSocket, socket }}>
      {children}
    </CommonText.Provider>
  );
};
