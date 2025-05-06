import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string
  ) => {
    api[type]({
      message: "Notification",
      description: message,
      style: {
        width: 600,
        height: 100,
      },
    });
  };

  return {
    openNotificationWithIcon,
    contextHolder,
  };
};

export default useNotification;
