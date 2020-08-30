<template>
  <div id="app">
    <notifications position="bottom center" />
    <router-view/>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.notification-title {
  font-size: 16px;
}

.notification-content {
  font-size: 16px;
}
</style>
