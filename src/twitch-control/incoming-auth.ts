void (async () => {
  const u = new URL(window.location.href);
  const code = u.searchParams.get("code");
  const state = u.searchParams.get("state");
  if (code && state) {
    await window.cookieStore.set({
      name: "a-incoming-code",
      value: code,
      expires: Date.now() + 600_000,
      sameSite: "strict",
    });
    await window.cookieStore.set({
      name: "a-incoming-state",
      value: state,
      expires: Date.now() + 600_000,
      sameSite: "strict",
    });
  }

  if (u.search) {
    u.search = "";
    window.location.replace(u.toString());
  }
})();
