import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const SendEmail=(email,uniqueString)=>{
    const msg = {
        to: email, 
        from: 'moatazwork0@gmail.com', 
        subject:'Email confirmation',
        text:`Here is The OTP (${uniqueString}). Thanks`
      }
      sgMail
      .send(msg)
      .then(() => {
      console.log('Email sent')
      })
      .catch((error) => {
      console.error(error)
      })
   
}
module.exports={SendEmail}