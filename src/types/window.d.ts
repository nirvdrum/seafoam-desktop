import { IPC } from "../electron/preload";
import { IPCEvents } from "../events";

declare global {
  interface Window {
    ipc_events: IPC<IPCEvents>;
    logger: Console;
  }
}
