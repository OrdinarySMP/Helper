export default defineNuxtRouteMiddleware(async (to) => {
  await useAuth().bootstrap();

  const isGuestPath = (path: string) => {
    return (
      ["/login", "/discord/callback"].find((guestPath: string) =>
        path.includes(guestPath),
      ) !== undefined
    );
  };

  if (isGuestPath(to.path) && useAuth().check) {
    return navigateTo("/");
  }

  if (!isGuestPath(to.path) && useAuth().guest) {
    console.log("sdfsdfsdf");
    return navigateTo("/login");
  }
});
