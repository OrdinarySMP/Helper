export default defineNuxtRouteMiddleware(async (to) => {
  await useAuth().bootstrap();

  const isGuestPath = (path: string) => {
    return (
      ["/login", "/discord/callback"].find((guestPath: string) => path.includes(guestPath)) !==
      undefined
    );
  };

  console.log(useAuth().check)

  console.log(useAuth().check)
  if (isGuestPath(to.path) && useAuth().check) {
    return navigateTo("/");
  }

  if (!isGuestPath(to.path) && useAuth().guest) {
    return navigateTo("/login");
  }
});
