import { RedisPubSub } from 'graphql-redis-subscriptions';
const { gql, withFilter } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const CHAT_SENT_TOPIC = 'newChat';
const redis = require("redis");
const client = redis.createClient({ port: process.env.REDDISPORT, host: process.env.REDDISHOST, password: process.env.REDDISPW });
const pubsub = new RedisPubSub({
    publisher: client,
    subscriber: client
});

const typeDefs = gql`

  type User {
    First_Name: String
    Last_Name: String
    id: Int
    user_avatar: String
    moderator: Boolean
    trophy: Boolean
    alias_name: String
    alias_avatar: String
    muted: Boolean
  }


  type Chat {
    id: Int
    user: User
    snippit_id: Int
    body: String
    starred: Boolean
    starred_by: Int
    starrer: User
    anony: Boolean
    created_at: String
    thread_updated: String
    last_updated: Time
    time_stamp: Time
    reactions: [Reaction]
    thread_chats: Int
    destiny_type: Int
    category: Int
    admin_tag: String
    is_boosted: Boolean
    mod_boosted: Boolean
    b_id: Int
    b_body: String
    b_First_Name: String
    b_Last_Name: String
    b_user_avatar: String
    b_alias_avatar: String
    b_alias_name: String
    b_anony: Boolean
    b_thread_chats: Int
    alert: Int
    experiment: Experiment
    project: String
  }

  type Experiment {
      id: Int
      user_id: Int
      user: User
      title: String
      description: String
      hypothesis: String
      chat_id: Int
      phase: Int
      conversation_id: Int
      moderator_id: Int
      moderator: User
      type: Int
      data: String
      conclusion: String
      direction: String
      market: String
  }

  type Reaction {
    id: Int
    user_id: Int
    chat_id: Int
    type: Int
  }


  type Time {
      stamp: String
  }

  
 type Query {
    Auth: User
  }

  type Subscription {
        chatSent(milestone: Int): Chat    
        
  }
`;


const resolvers = {
    Query: {
        Auth: async (parents, args) => {
            const status = { dog: "cow" }
            return status
        }
    },

    Subscription: {
        chatSent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(CHAT_SENT_TOPIC),
                (payload, variables) => {
                    return payload.chatSent.milestone === variables.milestone;
                },
            ),
        },

    },


}





const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;