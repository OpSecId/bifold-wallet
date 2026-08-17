function Null() {
  return null
}

function GiftedChat() {
  return null
}

GiftedChat.append = (currentMessages = [], messages = []) => messages.concat(currentMessages)

module.exports = {
  GiftedChat,
  Bubble: Null,
  Composer: Null,
  InputToolbar: Null,
  Send: Null,
  Actions: Null,
  default: GiftedChat,
}
