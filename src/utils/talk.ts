export const sendMessage = (message: string) => {
  console.log(message)

  // const timestamp = parseInt(new Date().getTime())
  // const groupID = this.activeGroup
  // const params = {
  //   content: data.message,
  //   groupID,
  //   timestamp,
  //   usertimestamp: timestamp,
  //   contentType: 'text/plain',
  //   userID: this.userInfo.showId,
  //   type: 1,
  //   protocol: 'ShowMsg',
  //   owner: 'self',
  //   txId: '',
  // }
  // let functionName = ''
  // let message = ''
  // let lastMessage = ''
  // if (data.type == 'friend') {

  // } else {
  //   if (data.messageType === 'text') {
  //     functionName = 'groupChat'
  //     message = data.message
  //     lastMessage = data.message
  //   }
  //   if (data.messageType === 'nftemoji') {
  //     functionName = 'groupNftEmojiChat'
  //     params.content = data.message.iconUrl
  //     params.protocol = 'SimpleEmojiGroupChat'
  //     params.contentType = 'image/url'
  //     message = data.message
  //     lastMessage = '[Emoji]'
  //   }
  //   if (data.messageType === 'image') {
  //     const fileName = data.message.name
  //     const result = await this.handleImgMessage(data.message)
  //     functionName = 'groupLocalImgChat'
  //     params.content = result.base64Data
  //     params.protocol = 'SimpleFileGroupChat'
  //     params.contentType = 'image/url'
  //     message = {
  //       data: result.hexData,
  //       fileName,
  //       fileType: 'image/jpeg',
  //     }
  //     lastMessage = '[Picture]'
  //   }
  //   if (data.messageType === 'chainimg') {
  //     const fileName = data.message.md5 + data.message.dataType.split('/')[1]
  //     functionName = 'groupChainImgChat'
  //     params.content = `metafile://${data.message.txId}`
  //     params.protocol = 'SimpleFileGroupChat'
  //     params.contentType = data.message.dataType
  //     message = {
  //       data: `metafile://${data.message.txId}`,
  //       fileName,
  //       fileType: data.message.dataType,
  //     }
  //     lastMessage = '[Picture]'
  //   }
  // }
  // this.groupGather[this.activeGroup].message.push(params)
  // setTimeout(() => {
  //   if (this.groupGather[this.activeGroup].messagestate[timestamp] !== 'finish') {
  //     this.$set(this.groupGather[this.activeGroup].messagestate, timestamp, 'error')
  //   }
  // }, 10000)
  // this.groupGather[this.activeGroup].lastMessageTime = timestamp
  // this.groupGather[this.activeGroup].messagestate[timestamp] = 'pending'
  // setTimeout(() => {
  //   this.$nextTick(() => {
  //     if (data.type == 'friend') {
  //       this.$refs.usermessage.scrollToBottom()
  //     } else {
  //       this.$refs.groupmessage.scrollToBottom()
  //     }
  //   })
  // }, 1000)
  // this.$store.commit('sortRoom')
  // this[functionName](message, timestamp, this.sendMessageCallback(groupID, timestamp, lastMessage))
}

export const validateMessage = (message: string) => {
  message = message.trim()

  return message.length > 0 && message.length <= 5000
}
