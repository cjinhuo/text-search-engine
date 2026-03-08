// src/client/build/preact.ts
import { useState } from "preact/hooks";

// src/client/build/register.ts
var autoUpdateMode = "__SW_AUTO_UPDATE__";
var selfDestroying = "__SW_SELF_DESTROYING__";
var auto = autoUpdateMode === "true";
var autoDestroy = selfDestroying === "true";
function registerSW(options = {}) {
  const {
    immediate = false,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisteredSW,
    onRegisterError
  } = options;
  let wb;
  let registerPromise;
  let sendSkipWaitingMessage;
  const updateServiceWorker = async (_reloadPage = true) => {
    await registerPromise;
    if (!auto) {
      await sendSkipWaitingMessage?.();
    }
  };
  async function register() {
    if ("serviceWorker" in navigator) {
      wb = await import("workbox-window").then(({ Workbox }) => {
        return new Workbox("__SW__", { scope: "__SCOPE__", type: "__TYPE__" });
      }).catch((e) => {
        onRegisterError?.(e);
        return void 0;
      });
      if (!wb)
        return;
      sendSkipWaitingMessage = async () => {
        await wb?.messageSkipWaiting();
      };
      if (!autoDestroy) {
        if (auto) {
          wb.addEventListener("activated", (event) => {
            if (event.isUpdate || event.isExternal)
              window.location.reload();
          });
          wb.addEventListener("installed", (event) => {
            if (!event.isUpdate) {
              onOfflineReady?.();
            }
          });
        } else {
          let onNeedRefreshCalled = false;
          const showSkipWaitingPrompt = () => {
            onNeedRefreshCalled = true;
            wb?.addEventListener("controlling", (event) => {
              if (event.isUpdate)
                window.location.reload();
            });
            onNeedRefresh?.();
          };
          wb.addEventListener("installed", (event) => {
            if (typeof event.isUpdate === "undefined") {
              if (typeof event.isExternal !== "undefined") {
                if (event.isExternal)
                  showSkipWaitingPrompt();
                else
                  !onNeedRefreshCalled && onOfflineReady?.();
              } else {
                if (event.isExternal)
                  window.location.reload();
                else
                  !onNeedRefreshCalled && onOfflineReady?.();
              }
            } else if (!event.isUpdate) {
              onOfflineReady?.();
            }
          });
          wb.addEventListener("waiting", showSkipWaitingPrompt);
          wb.addEventListener("externalwaiting", showSkipWaitingPrompt);
        }
      }
      wb.register({ immediate }).then((r) => {
        if (onRegisteredSW)
          onRegisteredSW("__SW__", r);
        else
          onRegistered?.(r);
      }).catch((e) => {
        onRegisterError?.(e);
      });
    }
  }
  registerPromise = register();
  return updateServiceWorker;
}

// src/client/build/preact.ts
function useRegisterSW(options = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisteredSW,
    onRegisterError
  } = options;
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateServiceWorker] = useState(() => {
    return registerSW({
      immediate,
      onOfflineReady() {
        setOfflineReady(true);
        onOfflineReady?.();
      },
      onNeedRefresh() {
        setNeedRefresh(true);
        onNeedRefresh?.();
      },
      onRegistered,
      onRegisteredSW,
      onRegisterError
    });
  });
  return {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker
  };
}
export {
  useRegisterSW
};
