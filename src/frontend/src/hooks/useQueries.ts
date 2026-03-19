import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GameScore } from "../backend";
import { useActor } from "./useActor";

export function useAllGameScores() {
  const { actor, isFetching } = useActor();
  return useQuery<GameScore[]>({
    queryKey: ["allGameScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGameScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTotalStars() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalStars"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalStars();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveGameScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      gameName,
      score,
    }: { gameName: string; score: number }) => {
      if (!actor) return;
      await actor.saveGameScore(gameName, BigInt(score));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGameScores"] });
    },
  });
}

export function useUpdateTotalStars() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stars: number) => {
      if (!actor) return;
      await actor.updateTotalStars(BigInt(stars));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["totalStars"] });
    },
  });
}
