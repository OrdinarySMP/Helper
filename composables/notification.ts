import type { Notification } from "@/types/notification";

export const useNotification = () => {
  const notifications = useState<Record<string, Notification | undefined>>(
    "notifications",
    () => ({}),
  );

  const addNotification = (notification: Notification) => {
    let uuid = "";
    do {
      uuid = makeUuid();
    } while (notifications.value[uuid]);
    notifications.value[uuid] = notification;
    setTimeout(() => {
      dissmiss(uuid);
    }, 5000);
    return uuid;
  };

  const error = (title: string, content: string) => {
    return addNotification({
      type: "error",
      title,
      content,
    });
  };

  const success = (title: string, content: string) => {
    return addNotification({
      type: "success",
      title,
      content,
    });
  };

  const reset = () => {
    notifications.value = {};
  };

  const dissmiss = (uuid: string) => {
    if (notifications.value[uuid]) {
      notifications.value[uuid] = undefined;
    }
  };

  const makeUuid = () => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  return {
    notifications,
    error,
    success,
    dissmiss,
    reset,
  };
};
