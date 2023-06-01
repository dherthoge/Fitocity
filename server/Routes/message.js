const express = require('express');
const router = express.Router();
const Chat = require("../models/chatModel");
//const {chats}=require("../models/data");
const User = require("../models/User");
const Message=require("../models/messageModel");



router.post('/', async(req, res)=>{
    const { content, chatId } = req.body;
    console.log("Hello",content);
    console.log("Hrllo",chatId);
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
    
});

router.get('/:chatId',async(req, res)=>{
    try {
        console.log(req.params.chatId);
        const messages = await Message.find({ chat: req.params.chatId })
        res.json(messages);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }

});

module.exports = router;
