import { Server, type Socket } from "socket.io";
import { customAlphabet } from "nanoid";
import { getRandomArticleTitles, type PageInfo } from "./fetchPage.js";
import Keyv, { KeyvHooks } from "keyv";
const PORT = 3000;

type UserInfo = {
  username: string;
  id: string;
};

type Leadeboard = {
  name: string;
  socket_id: string;
  time: number;
}[];

interface GameInfo {
  code: string;
  leader_id: string;
  players: UserInfo[];
  lb: Leadeboard;
  started: boolean;
}

interface ServerToClientEvents {
  start: (pages: PageInfo[]) => void;
  update_game: (gameInfo: GameInfo) => void;
}

interface ClientToServerEvents {
  start: (code: string) => void;
  new_game: (
    username: string,
    ackCallback: (gameInfo: GameInfo | Error) => void,
  ) => void;
  restart: (code: string) => void;
  join_game: (
    username: string,
    code: string,
    ackCallback: (gameState: GameInfo | Error) => void,
  ) => void;
  finish: (code: string, time: number) => void;
}

const cache = new Keyv<GameInfo>({
  ttl: 3 * 60 * 60 * 1000,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(PORT, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 5 * 60 * 1000,
    skipMiddlewares: true,
  },
  cleanupEmptyChildNamespaces: true,
});

cache.hooks.addHandler(KeyvHooks.POST_SET, ({ key, value }) => {
  console.log(`Set key ${key} to ${value}`);
  const trim_len = "keyv:".length;
  key = key.slice(trim_len);
  const json_val = JSON.parse(value).value;
  console.log(typeof json_val);
  io.to(key).emit("update_game", json_val);
});

console.log("RUNNING THE SERVER");

io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    if (socket.recovered) {
      console.log(socket.id + " recovered its connection");
    } else {
      console.log(socket.id + " joined the io");
    }

    socket.onAny((eventName, ...args) => {
      console.log("Event triggered: ", eventName);
    });

    socket.on("new_game", async (username, ackCallback) => {
      socket.data.username = username;
      console.log(username);
      const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
      const newGame: GameInfo = {
        code: nanoid(),
        started: false,
        leader_id: socket.id,
        players: [
          {
            id: socket.id,
            username: username,
          },
        ],
        lb: [],
      };

      cache.set(newGame.code, newGame);
      socket.join(newGame.code);
      ackCallback(newGame);
    });

    socket.on("join_game", async (username, code, ackCallback) => {
      console.log(username);
      if (!cache.has(code)) {
        ackCallback(new Error("Error: Incorrect code"));
      }
      socket.data.username = username;

      let gameInfo = await cache.get<GameInfo>(code);
      const user: UserInfo = { id: socket.id, username: socket.data.username };
      gameInfo?.players.push(user);
      cache.set(code, gameInfo);
      socket.join(code);

      if (gameInfo) {
        ackCallback(gameInfo);
      } else {
        ackCallback(new Error("Couldn't find the game"));
      }
    });

    socket.on("start", async (code) => {
      let gameInfo = await cache.get<GameInfo>(code);
      if (gameInfo) {
        gameInfo.started = true;
      }
      cache.set(code, gameInfo);
      const pages = await getRandomArticleTitles(2);
      console.log(pages);
      if (pages) {
        io.to(code).emit("start", pages);
      }
    });

    socket.on("restart", async (code) => {
      let gameInfo = await cache.get<GameInfo>(code);
      if (gameInfo) {
        gameInfo.lb = [];
      }
      const pages = await getRandomArticleTitles(2);
      if (pages) {
        io.to(code).emit("start", pages);
      }
    });
    socket.on("finish", async (code, time) => {
      let gameInfo = await cache.get<GameInfo>(code);
      const lb_entry = {
        name: socket.data.username,
        socket_id: socket.id,
        time: time,
      };
      gameInfo?.lb.push(lb_entry);
      cache.set(code, gameInfo);
    });

    socket.on("disconnect", (reason) => {
      console.log(
        socket.id + " disconnected from the server due to: " + reason,
      );
    });
  },
);
