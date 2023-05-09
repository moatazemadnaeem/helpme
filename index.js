require('dotenv').config()
const express =require('express') 
const cors=require('cors')
const cookieSession =require('cookie-session') 
require('express-async-errors')
const fileUpload = require('express-fileupload');

const mongoose =require('mongoose') 
//Users
const { signup } =require('./routes/UserRoutes/signup') 
const { signin } =require('./routes/UserRoutes/signin') 
const { signout } =require('./routes/UserRoutes/signout') 
const { current } =require('./routes/UserRoutes/current-user') 
const {updateUser} =require('./routes/UserRoutes/update-user')
const {add_profile_pic}=require('./routes/UserRoutes/AddprofileImg')
const {resend_otp}=require('./routes/UserRoutes/resendOtp')
const {forgot_password}=require('./routes/UserRoutes/forgotPassword')
const {reset_password}=require('./routes/UserRoutes/resetPassword')
const {resend_otp_reset}=require('./routes/UserRoutes/resendOtpReset')
const {verfiy_user}=require('./routes/UserRoutes/verify')

//chat
const {send_msg}=require('./routes/chatsRoutes/SendMsg')
const {get_chats_user}=require('./routes/chatsRoutes/GetChatByUser')
const {get_chats}=require('./routes/chatsRoutes/GetChannels')

//Technical
const {technical_data}=require('./routes/technicalRoutes/technical_data')
const {edit_certificate}=require('./routes/technicalRoutes/edit_certificate_img')
const {get_technical_data}=require('./routes/technicalRoutes/getTechnicalData')
const {edit_technical_data}=require('./routes/technicalRoutes/edit_technical_data')
const {get_technicals}=require('./routes/technicalRoutes/get_technicals')
const {rate_technical}=require('./routes/technicalRoutes/rate_technical')

//Services
const {create_service}=require('./routes/servicesRoutes/CreateService')
const {get_services_by_user}=require('./routes/servicesRoutes/getServicesByUser')
const {get_services}=require('./routes/servicesRoutes/getAllServices')
const {edit_service}=require('./routes/servicesRoutes/EditService')
const {rate_service}=require('./routes/servicesRoutes/rate_service')

const { handelerr } =require('./middlewares/handelError') 
const {notfound}=require('./errorclasses/notfound')
const {BadReqErr}=require('./errorclasses/badReq')

const app=express()
const port=process.env.PORT||9000
app.use(fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
    createParentPath: true,

}));
app.use(
    cookieSession({
        signed:false,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded());
//users
app.use('/api/users',signup)
app.use('/api/users',signin)
app.use('/api/users',signout)
app.use('/api/users',current)
app.use('/api/users',updateUser)
app.use('/api/users',add_profile_pic)
app.use('/api/users',resend_otp)
app.use('/api/users',forgot_password)
app.use('/api/users',reset_password)
app.use('/api/users',resend_otp_reset)
app.use('/api/users',verfiy_user)

//chat
app.use('/api/chat',send_msg)
app.use('/api/chat',get_chats)
app.use('/api/chat',get_chats_user)

//technical
app.use('/api/technical',technical_data)
app.use('/api/technical',edit_certificate)
app.use('/api/technical',get_technical_data)
app.use('/api/technical',edit_technical_data)
app.use('/api/technical',get_technicals)
app.use('/api/technical',rate_technical)

//Services
app.use('/api/services',create_service)
app.use('/api/services',get_services_by_user)
app.use('/api/services',get_services)
app.use('/api/services',edit_service)
app.use('/api/services',rate_service)

app.all('*',()=>{
    throw new notfound('can not find this page please try again')
})
app.use(handelerr)
const start=async()=>{
  
    if(!process.env.JWT_KEY){
        throw new BadReqErr('Jwt is not defined')
    }
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('connected to db')
        app.listen(port,()=>{
            console.log(`listening in port ${port}`)
        })
    }catch (err){
        console.log(err,'err to connect')
    }
}
start()