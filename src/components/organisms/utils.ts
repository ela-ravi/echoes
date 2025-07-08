import { ClientStatus } from "../../types/NewsItem";

export const getClientStatus = (
  status: ClientStatus,
  publishedBy?: string[],
  rejectedBy?: string[],
) => {
  const userInfo = sessionStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;
  const userName = user?.name;
  const userType = user?.type;
  const isClient = userType === "CLIENT";
  // const isAdmin = userType === "ADMIN";
  if (isClient) {
    if (publishedBy?.includes(userName)) {
      return ClientStatus.PUBLISHED;
    } else if (rejectedBy?.includes(userName)) {
      return ClientStatus.REJECTED;
    }
    return status;
  }
  return status;
};
