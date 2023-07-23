import { ObjectId } from "mongodb"
import { PipelineStage } from "mongoose"

export abstract class UserProjection {

  static user: { [key: string]: any } = {
    "_id": true,
    "name": true,
    "email": true,
    "type": true,
    "chatCount": {
      $size: {
        $filter: {
          input: "$chats",
          as: "chat",
          cond: { $eq: ["$$chat.isActive", true] }
        }
      }
    },
  }

  static allChatCount: { [key: string]: any } = {
    "_id": true,
    "chatCount": { $size: "$chats" },
  }

  static chatCount: { [key: string]: any } = {
    "_id": true,
    "chatCount": {
      $size: {
        $filter: {
          input: "$chats",
          as: "chat",
          cond: { $eq: ["$$chat.isActive", true] }
        }
      }
    },
  }

  static allChatMessageCount: { [key: string]: any } = {
    "chat._id": true,
    "chat.messageCount": { $size: "$chat.messages" },
  }

  static chatMessageCount: { [key: string]: any } = {
    "chat._id": true,
    "chat.messageCount": {
      $size: {
        $filter: {
          input: "$chat.messages",
          as: "message",
          cond: { $eq: ["$$message.isActive", true] }
        }
      }
    },
  }

  static chatsLean: { [key: string]: any } = {
    "_id": true,
    "chats._id": true,
    "chats.title": true,
    "chats.index": true,
  }

  static chat: { [key: string]: any } = {
    "chat._id": true,
    "chat.title": true,
    "chat.settings": true,
    "chat.index": true,
    "chat.messageCount": {
      $size: {
        $filter: {
          input: "$chat.messages",
          as: "message",
          cond: { $eq: ["$$message.isActive", true] }
        }
      }
    },
  }

  static message: { [key: string]: any } = {
    "message._id": true,
    "message.index": true,
    "message.content": true,
    "message.isUser": true,
    "message.createdOn": true,
    "message.choices": true,
    "message.choiceIndex": true,
  }

  static messages: { [key: string]: any } = {
    "messages._id": true,
    "messages.index": true,
    "messages.content": true,
    "messages.isUser": true,
    "messages.createdOn": true,
    "messages.choices": true,
    "messages.choiceIndex": true,
  }
}

export abstract class UserPipeline {

  static user(userId: string): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: UserProjection.user
      }
    ]

    return aggregate;
  }

  static userByEmail(email: string): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { email: email }
      },
      {
        $project: UserProjection.user
      }
    ]

    return aggregate;
  }

  static chats(userId: string, page: number, count: number): PipelineStage[] {
    const startIndex = (page - 1) * count;
    const endIndex = startIndex + count;
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: {
          chats: {
            $filter: {
              input: "$chats",
              cond: { $eq: ["$$this.isActive", true] }
            }
          }
        }
      },
      {
        $project: {
          chats: {
            $sortArray: { input: "$chats", sortBy: { "latestMessageCreatedOn": -1 } }
          }
        }
      },
      {
        $project: UserProjection.chatsLean
      },
      {
        $project: {
          chats: {
            $slice: ["$chats", startIndex, endIndex]
          }
        }
      }
    ];

    return aggregate;
  }

  static chatLatest(userId: string): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: {
          chat: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$chats",
                  cond: { $eq: ["$$this.isActive", true] }
                }
              },
              -1
            ]
          }
        }
      },
      {
        $project: UserProjection.chat
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
        $match: { "chat.isActive": true }
      },
      {
        $project: UserProjection.chat
      }
    ]

    return aggregate;
  }

  static chatIndexMessageCount(userId: string, chatIndex: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $match: { "chat.isActive": true }
      },
      {
        $project: UserProjection.chatMessageCount
      }
    ]

    return aggregate;
  }

  static chatIndexAllMessageCount(userId: string, chatIndex: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $project: UserProjection.allChatMessageCount
      }
    ]

    return aggregate;
  }

  static messages(userId: string, chatIndex: number, startIndex: number, count: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $match: { "chat.isActive": true }
      },
      {
        $project: {
          messages: {
            $filter: {
              input: "$chat.messages",
              cond: { $eq: ["$$this.isActive", true] }
            }
          }
        }
      },
      {
        $project: UserProjection.messages
      },
      {
        $project: {
          messages: {
            $slice: [
              "$messages",
              { $subtract: [{ $size: "$messages" }, startIndex + count] },
              count
            ]
          }
        }
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
        $match: { "chat.isActive": true }
      },
      {
        $project: { message: { $arrayElemAt: ["$chat.messages", messageIndex] } }
      },
      {
        $match: { "message.isActive": true }
      },
      {
        $project: UserProjection.message
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
        $match: { "chat.isActive": true }
      },
      {
        $project: {
          message: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$chat.messages",
                  cond: { $eq: ["$$this.isActive", true] }
                }
              },
              -1
            ]
          }
        }
      },
      {
        $project: UserProjection.message
      }
    ]

    return aggregate;
  }

  static messageIndexChoices(userId: string, chatIndex: number, messageIndex: number): PipelineStage[] {
    const aggregate: PipelineStage[] = [
      {
        $match: { _id: new ObjectId(userId) }
      },
      {
        $project: { chat: { $arrayElemAt: ["$chats", chatIndex] } }
      },
      {
        $match: { "chat.isActive": true }
      },
      {
        $project: { message: { $arrayElemAt: ["$chat.messages", messageIndex] } }
      },
      {
        $match: { "message.isActive": true }
      },
      {
        $project: { choices: "$message.choices" }
      }
    ];

    return aggregate;
  }
}