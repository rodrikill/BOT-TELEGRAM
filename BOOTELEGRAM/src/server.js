const { PrismaClient } = require('@prisma/client');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
let adicionar = false
let activeChat = true

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  let email = msg.text;
  let tempo = new Date().getHours();
  
  async function main(){
    if (adicionar && msg.text.includes('@')){
      await inserEmail(email, bot, chatId)
      adicionar = false
    }
    if (adicionar && !msg.text.includes('@')){
      bot.sendMessage(chatId, 'Por favor, envie um email válido');
      adicionar = true
    }

    if (tempo > 9 && tempo < 18) {
      bot.sendMessage(chatId, 'https://faesa.br');
    } else {
        if (activeChat && !msg.text.includes('@')){
          bot.sendMessage(chatId, 'Olá, no momento não estamos funcionando, deixe um email VÁLIDO e entraremos em contato');
          adicionar = true
          activeChat = false
        } 
    }
  }
  main()
});
async function inserEmail(email, bot, chatId){
  const prisma = new PrismaClient()
  const objectInsert = await prisma.email.create({
    data: {
      email: email
    }
  })
  try {
    await prisma.$disconnect()

  } catch {
    console.log("problemas internos")

  }
  bot.sendMessage(chatId, 'Email cadastrado, entraremos em contato em breve');
}