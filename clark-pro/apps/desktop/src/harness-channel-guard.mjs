import { assertMessage } from "@clark-pro/harness/protocol";

export class HarnessChannelGuard {
  constructor() {
    this.reset();
  }

  reset() {
    this.lastEventSequence = 0;
  }

  accept(rawMessage, pendingRequests) {
    const message = assertMessage(rawMessage);
    if (message.kind === "event") {
      if (message.sequence !== this.lastEventSequence + 1) {
        throw new Error("Harness event sequence was replayed or reordered");
      }
      this.lastEventSequence = message.sequence;
      return message;
    }
    if (message.kind !== "response") {
      throw new Error("Harness sent a non-response on the command channel");
    }
    const pending = pendingRequests.get(message.requestId);
    if (!pending || pending.method !== message.method) {
      throw new Error("Harness sent an unknown or mismatched response ID");
    }
    return message;
  }
}
