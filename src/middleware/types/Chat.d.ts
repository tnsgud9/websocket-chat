type roomType = {
  managerId: string;
  users: string[];
  messages: messageType[];
};

type messageType = {
  context: string;
  isImage: boolean;
  user: string;
  date: string;
};
