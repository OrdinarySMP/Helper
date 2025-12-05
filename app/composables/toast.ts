export const useSimpleToast = () => {
  const toast = useToast();

  const success = (message: string) => {
    toast.add({
      title: message,
      icon: "mdi:check-circle-outline",
      color: "success" as const,
    });
  };

  const error = (message: string) => {
    toast.add({
      title: message,
      icon: "mdi:circle-off-outline",
      color: "error" as const,
    });
  };

  return { success, error };
};
