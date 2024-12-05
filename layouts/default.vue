<template>
  <div class="flex min-h-screen flex-col">
    <LayoutHeader />
    <div class="flex grow px-12 py-2">
      <slot />
    </div>
    <Notification />
    <LayoutFooter />
  </div>
</template>
