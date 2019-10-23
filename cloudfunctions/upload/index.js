const cloud = require('wx-server-sdk')
const CryptoJS = require("crypto-js")

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async(event, context) => {
  // const dbResult = await cloud.database().collection('test').get()

  var hash = CryptoJS.SHA256("Message");
  console.log(hash.toString(CryptoJS.enc.Hex))
  // const fileStream = fs.createReadStream(event.file.path)

  const buf = Buffer.from(event.file.path, 'utf8');
  const buf2 = Buffer.from("http://tmp/wx7b6f160a492b0b57.o6zAJs2loXSzW3D8ugdiJv7RHC8w.DHzTWta8oxOX2c333629895e1d71b8d325ddbc229132.jpg", 'utf8');

  // await cloud.uploadFile({
  //   cloudPath: 'demo.jpg',
  //   fileContent: buf,
  // })
  return {buf,buf2}
}