<template>
  <div class="hint-banner">
    <kbd class="hint-key">⌘C</kbd>
    <span
      >without selection to enter grab mode — click any component to copy an AI-ready prompt</span
    >
  </div>
</template>

<style scoped>
.hint-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 32px;
  background: #1c1c1c;
  color: #888;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.hint-key {
  background: #2e2e2e;
  color: #ccc;
  padding: 2px 7px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #444;
  flex-shrink: 0;
}
</style>
