export const isCoachForClient = (
  coachId: number,
  clientCoachId: number,
): boolean => coachId === clientCoachId;

export const isRequestingOwnData = (
  userIdToRequest: number,
  requestingUserId: number,
): boolean => userIdToRequest === requestingUserId;
