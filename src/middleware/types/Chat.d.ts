export type roomType = {
  managerId: string;
  user: string;
  messages: messageType[];
};

export type ChatHistoryType = {
  manager: string;
  user: string;
  messages: messageType[];
  startDate: string;
  endDate: string;
};

export type messageType = {
  context: string;
  isImage: boolean;
  user: string;
  date: string;
};
