const { TelegramClient } = require('telegram');
const { StoreSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events"); // npm i input
const input = require('input');
require("dotenv").config();

const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;
const myId = process.env.MY_ID;
var data_selected = null;
var question_show = null;
var recall = false;
const STATES = {
  BASE: `Hi, BOT Master Online Community disini. Ada yang bisa kami bantu? Anda cukup tinggal menuliskan angka saja, dan Saya bantu menampilkan data yang kamu butuhkan.

    **1.** Tentang MOC
    **2.** Produk Kita
    **3.** Cara Order
    **4.** Bantuan`,
  ABOUT_MOC: `Baik akan kami bantu untuk menjelaskan mengenai Master Online Community. apa yang ingin ada cari tau?
Pilih dan ketik sesuai nomor yang kamu pilih :

    **1.** Apa itu Master Online Comminity
    **2.** Bagaimana cara menjadi bagian dari MOC?

    **0.** Kembali ke menu sebelumnya`,
  DESC_MOC: `Master online community atau PT. MOC Milenial Indonesia, Merupakan perusahaan Supplier & Online Business yang banyak menciptakan brand produk Suplemen Herbal, Skincare dan Body Care.

  PT. MOC Milenial Indonesia juga membuat Aplikasi & Platform Bisnis Online yaitu @Masteronlinecommunity dan @Bisnismillenial Sejak Akhir tahun 2017.
  
  Di platform tersebut selain menyediakan produk untuk dijual, juga menyediakan sistem, training dan mentoring untuk meningkatkan skill & knowlage dalam menjalankan bisnis di Online.`,
  ASK_FOR_AGE: "asks the user for their age",
}; // different states

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(
    new StoreSession("prince_of_hell"),
    apiId,
    apiHash,
    {
      connectionRetries: 5,
    }
  );

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  client.addEventHandler(async (event) => {
    const message_text = event.message.text;
    const sender = event.message.senderId;
    console.log(sender + ' : ' + message_text);
    if (myId != sender) {
      await client.sendMessage(sender, { message: settingFunc(message_text) });
      if (recall == true) {
        await client.sendMessage(sender, { message: settingFunc(data_selected) });
        recall = false
      }
    }
  }, new NewMessage());
})();

function settingFunc(message_text) {
  console.log(question_show+' - '+ message_text);
  if (data_selected == null && question_show == null) {
    data_selected = message_text
    question_show = 'base'
    return STATES.BASE
  } else {

    if (question_show == 'base') {
      if (message_text == 1) {
        data_selected = message_text
        question_show = 'about_moc'
        return STATES.ABOUT_MOC
      }else if (message_text == 0) {
        data_selected = null
        question_show = null
        return STATES.BASE
      } else {
        return STATES.BASE
      }

    }else if(question_show=='about_moc'){
      if (message_text==1) {
        data_selected= message_text
        question_show='about_moc'
        recall = true
        data_selected =0
        return STATES.DESC_MOC

      }else if(message_text == 0){
        data_selected = null
        question_show = null
        return STATES.BASE

      }else{
        return STATES.ABOUT_MOC
      }

    }else{
      data_selected = null
        question_show = null
        return STATES.BASE
    }
    console.log(data_selected + ' - ' + question_show);
    data_selected = message_text
  }
}
