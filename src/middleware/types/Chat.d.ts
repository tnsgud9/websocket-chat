export type roomType = {
  managerId: string;
  user: string;
  messages: messageType[];
};

export type messageType = {
  context: string;
  isImage: boolean;
  user: string;
  date: string;
};
