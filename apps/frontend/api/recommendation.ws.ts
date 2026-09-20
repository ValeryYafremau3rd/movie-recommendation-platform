import { Movie } from "@/types/movie";

const WS_URL = process.env.NEXT_PUBLIC_RECOMMENDATION_API_URL;

let socket: WebSocket | null = null;

type Callbacks = {
  onRecommendations: (movies: Movie[]) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
};

export function requestRecommendations(
  liked: Movie[],
  disliked: Movie[],
  saved: Movie[],
  callbacks: Callbacks,
) {
  if (socket?.readyState === WebSocket.OPEN) {
    send(liked, disliked, saved, callbacks);
    return;
  }

  socket = new WebSocket(`${WS_URL}/recommendations`);

  socket.onopen = () => {
    send(liked, disliked, saved, callbacks);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    callbacks.onLoading(false);

    if (data.type === "error") {
      callbacks.onError(data.error);
      return;
    }

    if (data.type === "recommendations") {
      callbacks.onRecommendations(data.movies);
    }
  };

  socket.onerror = () => {
    callbacks.onLoading(false);
    callbacks.onError("Recommendation service error");
  };

  socket.onclose = () => {
    socket = null;
  };
}

function send(
  liked: Movie[],
  disliked: Movie[],
  saved: Movie[],
  callbacks: Callbacks,
) {
  callbacks.onLoading(true);

  socket!.send(
    JSON.stringify({
      liked,
      disliked,
      saved,
    }),
  );
}
