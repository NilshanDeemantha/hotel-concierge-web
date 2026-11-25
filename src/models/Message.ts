import { where, type QueryDocumentSnapshot } from "firebase/firestore";
import { CONVERSATIONS_TEXT } from "@/content/admin";
import { MODEL_CONFIG } from "./config";
import { Model } from "./Model";

export type MessageData = { id: string; role: string; content: string; createdAt: Date | null };

/** One message in a conversation: from the guest, from Xenia or from staff. Written by the server only. */
export class Message extends Model<MessageData> {
  static collection = "messages";
  static limit: number = MODEL_CONFIG.limits.messages;

  readonly role: string;
  readonly content: string;
  readonly createdAt: Date | null;

  constructor(data: MessageData) {
    super(data);
    this.role = data.role;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }

  static fromSnapshot(d: QueryDocumentSnapshot) {
    return new Message({
      id: d.id,
      role: d.get("role"),
      content: d.get("content"),
      createdAt: Model.toDate(d.get("createdAt")),
    });
  }

  static ofConversationQuery(conversationId: string) {
    return this.listQuery(where("conversationId", "==", conversationId));
  }

  /** Oldest first; messages still waiting for their server timestamp go last. */
  static oldestFirst(a: Message, b: Message) {
    return (a.createdAt?.getTime() ?? Infinity) - (b.createdAt?.getTime() ?? Infinity);
  }

  toData(): MessageData {
    const { id, role, content, createdAt } = this;
    return { id, role, content, createdAt };
  }

  get isGuest() {
    return this.role === "user";
  }
  get isStaff() {
    return this.role === "staff";
  }
  get roleLabel() {
    return CONVERSATIONS_TEXT.roles[this.role] ?? this.role;
  }
}
