import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamName,
      captainName,
      phoneNumber,
      tournament,
    }: {
      teamName: string;
      captainName: string;
      phoneNumber: string;
      tournament: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitRegistration(
        teamName,
        captainName,
        phoneNumber,
        tournament,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useGetAllRegistrations() {
  const { actor, isFetching } = useActor();

  return useQuery<
    Array<{
      teamName: string;
      captainName: string;
      phoneNumber: string;
      tournament: string;
    }>
  >({
    queryKey: ["registrations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRegistrationsByTournament();
    },
    enabled: !!actor && !isFetching,
  });
}
