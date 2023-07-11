import { ObjectId } from "mongodb"
import { PipelineStage } from "mongoose"

export abstract class UserProjection {
  static user: { [key: string]: boolean } = {
    "_id": true,
    "name": true,
    "email": true,
  }

  static chats: { [key: string]: boolean } = {
    "_id": true,
    "chats": true,
  }

  static chatsLean: { [key: string]: boolean } = {
    "_id": true,
    "chats._id": true,
    "chats.title": true,
  }

  static chat: { [key: string]: boolean } = {
    "chat._id": true,
    "chat.title": true,
    "chat.settings": true,
  }

  static message: { [key: string]: any } = {
    "message._id": true,
    "message.content": true,
    "message.isUser": true,
    "message.creationTime": true,
    "message.choices": { $size: "$message.choices" },
  }
}

export abstract class UserPipeline {

  static chatLatest(userId: string): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", -1] } }
      },
      {
        $project: UserProjection.chat
      },
      {
        $limit: 1
      }
    ]

    return aggregate;
  }

  static chatId(userId: string, chatIndex: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $limit: 1
      }
    ]

    return aggregate;
  }

  static messageLatest(userId: string, chatIndex: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $project: { message: { $arrayElemAt: ["$chat.messages", -1] } }
      },
      {
        $project: UserProjection.message
      },
      {
        $limit: 1
      }
    ]

    return aggregate;
  }
}