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

  static chat: { [key: string]: any } = {
    "chat._id": true,
    "chat.title": true,
    "chat.settings": true,
    "chat.messageCount": { $size: "$chat.messages" },
  }

  static message: { [key: string]: any } = {
    "message._id": true,
    "message.content": true,
    "message.isUser": true,
    "message.creationTime": true,
    "message.choices": true,
    "message.choiceIndex": true,
  }

  static messages: { [key: string]: any } = {
    "messages._id": true,
    "messages.content": true,
    "messages.isUser": true,
    "messages.creationTime": true,
    "messages.choices": true,
    "messages.choiceIndex": true
  }
}

export abstract class UserPipeline {

  static chats(userId: string, page: number, count: number): PipelineStage[] {
    const startIndex = (page - 1) * count;
    const endIndex = startIndex + count;
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chats: { $slice: ["$chats", startIndex, endIndex] } }
      },
      {
        $project: UserProjection.chatsLean
      },
      {
        $limit: 1
      }
    ]

    return aggregate;
  }

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

  static chatIndex(userId: string, chatIndex: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
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

  static messages(userId: string, chatIndex: number, page: number, count: number): PipelineStage[] {
    const startIndex = (page - 1) * count;
    const endIndex = startIndex + count;
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $project: { messages: { $slice: ["$chat.messages", startIndex, endIndex] } }
      },
      {
        $project: UserProjection.messages
      },
      {
        $limit: 1
      }
    ]

    return aggregate;
  }

  static messageIndex(userId: string, chatIndex: number, messageIndex: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $project: { message: { $arrayElemAt: ["$chat.messages", messageIndex] } }
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