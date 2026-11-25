import { orderBy, type QueryDocumentSnapshot } from "firebase/firestore";
import { CONVERSATIONS_TEXT } from "@/content/admin";
import { adminPost } from "@/lib/admin-api";
import { MODEL_CONFIG } from "./config";
import { Model } from "./Model";

export type ConversationData = { id: string; uid: string; messageCount: number; updatedAt: Date | null };

/** One guest's chat with Xenia. The server writes it; staff can only read it and reply. */
export class Conversation extends Model<ConversationData> {
  static collection = "conversations";
  static limit: number = MODEL_CONFIG.limits.conversations;

  readonly uid: string;
  readonly messageCount: number;
  readonly updatedAt: Date | null;

  constructor(data: ConversationData) {
    super(data);
    this.uid = data.uid;
    this.messageCount = data.messageCount;
    this.updatedAt = data.updatedAt;
  }

  static fromSnapshot(d: QueryDocumentSnapshot) {
    return new Conversation({
      id: d.id,
      uid: d.get("uid"),
      messageCount: d.get("messageCount") ?? 0,
      updatedAt: Model.toDate(d.get("updatedAt")),
    });
  }

  /** The most recent first. */
  static recentQuery() {
    return this.listQuery(orderBy("updatedAt", "desc"));
  }

  toData(): ConversationData {
    const { id, uid, messageCount, updatedAt } = this;
    return { id, uid, messageCount, updatedAt };
  }

  get messageLabel() {
    return CONVERSATIONS_TEXT.messages(this.messageCount);
  }

  /** Posts a staff message into this conversation. Throws a ServerError. */
  async sendStaffMessage(text: string) {
    await adminPost("admin_send_message", { conversationId: this.id, text });
  }
}
