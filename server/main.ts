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

type ErrorObject = {
  message: string;
  name: string;
};

const createError = (name: string, message: string): ErrorObject => {
  return { name, message };
};

interface GameInfo {
  code: string;
  num: number;
  leader_id: string;
  players: UserInfo[];
  lb: Leadeboard;
  started: boolean;
}

interface ServerToClientEvents {
  start: (pages: PageInfo[]) => void;
  update_game: (gameInfo: GameInfo | null) => void;
  finisher: (username: string) => void;
  end_game: () => void;
}

interface ClientToServerEvents {
  start: () => void;
  end_game: () => void;
  new_game: (
    username: string,
    num_players: number,
    ackCallback: (response: [ErrorObject | null, GameInfo | null]) => void,
  ) => void;
  kick_player: (user: UserInfo) => void;
  restart: () => void;
  join_game: (
    username: string,
    code: string,
    ackCallback: (response: [ErrorObject | null, GameInfo | null]) => void,
  ) => void;
  finish: (time: number) => void;
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
  const trim_len = "keyv:".length;
  key = key.slice(trim_len);
  const json_val = JSON.parse(value).value;
  io.to(key).emit("update_game", json_val);
});

cache.hooks.addHandler(KeyvHooks.POST_DELETE, ({ key }) => {
  const trim_len = "keyv:".length;
  key = key.slice(trim_len);
  io.to(key).emit("update_game", null);
});

console.log("RUNNING THE SERVER");

io.of("/").adapter.on("delete-room", async (room) => {
  const isSocketId = io.sockets.sockets.has(room);
  if (!isSocketId) {
    await cache.delete(room);
    console.log("DELETED ROOM");
  }
});

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
      // TODO: Do better logging
    });

    socket.on("new_game", async (username, num_players, ackCallback) => {
      socket.data.username = username;
      const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
      const newGame: GameInfo = {
        code: nanoid(),
        started: false,
        leader_id: socket.id,
        num: num_players,
        players: [
          {
            id: socket.id,
            username: username,
          },
        ],
        lb: [],
      };

      socket.data.code = newGame.code;
      await cache.set(newGame.code, newGame);
      socket.join(newGame.code);
      ackCallback([null, newGame]);
    });

    socket.on("end_game", async () => {
      const code = socket.data.code;
      await cache.delete(code);
      socket.data.code = null;

      const member_sockets = await io.in(code).fetchSockets();
      member_sockets.forEach((socket) => {
        socket.data.code = null;
      });

      socket.to(code).emit("end_game");

      member_sockets.forEach((socket) => {
        socket.leave(code);
      });
    });

    socket.on("kick_player", async (user) => {
      const code = socket.data.code;
      let game = await cache.get(code);
      const idx =
        game?.players.findIndex((val) => val.username === user.username) ?? -1;
      if (idx != -1) {
        game?.players.splice(idx, 1);
      }
      await cache.set(code, game);
    });

    socket.on("join_game", async (username, code, ackCallback) => {
      if (!cache.has(code)) {
        ackCallback([
          createError("JoinGameError", "No game found with the given code"),
          null,
        ]);
        return;
      }
      socket.data.username = username;
      socket.data.code = code;

      let gameInfo = await cache.get<GameInfo>(code);
      if (gameInfo && gameInfo?.players.length >= gameInfo?.num) {
        ackCallback([createError("JoinGameError", "Game is full"), null]);
        return;
      }

      const user: UserInfo = { id: socket.id, username: socket.data.username };
      gameInfo?.players.push(user);
      await cache.set(code, gameInfo);
      socket.join(code);

      if (gameInfo) {
        ackCallback([null, gameInfo]);
      } else {
        ackCallback([
          createError("JoinGameError", "No game found with the given code"),
          null,
        ]);
      }
    });

    socket.on("start", async () => {
      const code = socket.data.code;
      let gameInfo = await cache.get<GameInfo>(code);
      if (gameInfo) {
        gameInfo.started = true;
      }
      await cache.set(code, gameInfo);
      const pages = await getRandomArticleTitles(2);
      if (pages) {
        io.to(code).emit("start", pages);
      }
    });

    socket.on("restart", async () => {
      const code = socket.data.code;
      let gameInfo = await cache.get<GameInfo>(code);
      if (gameInfo) {
        gameInfo.lb = [];
        gameInfo.started = true;
      }
      await cache.set(code, gameInfo);
      const pages = await getRandomArticleTitles(2);
      if (pages) {
        io.to(code).emit("start", pages);
      }
    });
    socket.on("finish", async (time) => {
      const code = socket.data.code;
      let gameInfo = await cache.get<GameInfo>(code);
      const lb_entry = {
        name: socket.data.username,
        socket_id: socket.id,
        time: time,
      };
      gameInfo?.lb.push(lb_entry);
      await cache.set(code, gameInfo);
      socket.to(code).emit("finisher", socket.data.username);
    });

    socket.on("disconnect", async (reason) => {
      const code = socket.data.code;

      let gameInfo = await cache.get(code);
      const lb_index =
        gameInfo?.lb.findIndex((obj) => obj.socket_id === socket.id) ?? -1;
      const player_index =
        gameInfo?.players.findIndex((obj) => obj.id === socket.id) ?? -1;

      if (lb_index !== -1) gameInfo?.lb.splice(lb_index, 1);
      if (player_index !== -1) gameInfo?.players.splice(player_index, 1);

      await cache.set(code, gameInfo);

      console.log(
        socket.id + " disconnected from the server due to: " + reason,
      );
    });
  },
);
