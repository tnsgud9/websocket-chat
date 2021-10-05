type roomType = {
  userList: string[];
  messageType: messageType[];
};

type messageType = {
  message: string;
  user: string;
  date: string;
};
