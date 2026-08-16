const express = require("express");
const router = express.Router();
const {userModel,pendingUserModel,otpModel} = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isProduction= process.env.PROD_STAGE==="production";
const {Resend} = require('resend');
const resend =  new Resend(process.env.RESEND_API_KEY);
const cookie_parser= require('cookie-parser');

router
  .post("/sign-up", async (req, res) => {
    try {
      if(!req.body.name || !req.body.password || !req.body.email){
        return res.status(400).json({
          message: "Input fields missing",
        })
      }
      if((await userModel.exists({email:req.body.email}))){
        return res.status(409).json({message:'User already exists'});
      }
      const hashedPassword = await bcrypt.hash(req.body.password,10);

      if(!(await pendingUserModel.exists({email:req.body.email}))){
        await pendingUserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        age: req.body.age,
        sex: req.body.sex,
        weight: req.body.weight,
        height: req.body.height,
        expiresAt: new Date(Date.now()+24*60*60*1000)
      });
      }
      else{
        await pendingUserModel.updateOne({email:req.body.email},{
          $set:{
        name: req.body.name,
        password: hashedPassword,
        age: req.body.age,
        sex: req.body.sex,
        weight: req.body.weight,
        height: req.body.height,
        expiresAt: new Date(Date.now()+24*60*60*1000)
          }
        })
      }
      const validOtp= Math.trunc(100000 + Math.random() * 900000);
      const hashedOtp = await bcrypt.hash(String(validOtp),10);
      const pendingUser= await pendingUserModel.findOne({email:req.body.email});
      if(!(await otpModel.exists({email:req.body.email}))){
        const otp= await otpModel.create({
        pendingUserId:pendingUser._id,
        email:req.body.email,
        otp:hashedOtp,
        expiresAt: new Date(Date.now()+ 10*60*1000 )
      })
      }
      else{
        await otpModel.updateOne({email:req.body.email},{
            $set:{
              pendingUserId:pendingUser._id,
              otp:hashedOtp,
              expiresAt: new Date(Date.now()+ 10*60*1000 )
            }
        })
      }
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: req.body.email,
        subject: "OTP",
        html: `<p>Your OTP is: ${validOtp}.</p>`,
      });


      res.cookie('pending_signup',pendingUser._id.toString(),{
        maxAge:24*60*60*1000,
        httpOnly:true,
        secure:isProduction,
        sameSite: isProduction?'none':'lax',
      })
      res
        .status(201)
        .json({
          message: "User awaiting verification"
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }).post('/verify-otp',async (req,res)=>{
    try{
      console.log('BODY:', JSON.stringify(req.body), 'TYPE:', typeof req.body);
      if(!req.body || req.body.trim() === ""){
        return res.status(400).json({
          message:"OTP not entered"
        });
      }
      let user;
      const user_id= req.cookies.pending_signup;
      const enteredOtp= req.body;
      const pendingUser= await pendingUserModel.findOne({_id:user_id});
      const otpObj= await otpModel.findOne({pendingUserId:user_id});
      const isMatch= await bcrypt.compare(enteredOtp,otpObj.otp);
      if(isMatch){
        user= await userModel.create({
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
        age: pendingUser.age,
        sex: pendingUser.sex,
        weight: pendingUser.weight,
        height: pendingUser.height, 
        })
        const delPendingUser= await pendingUserModel.findByIdAndDelete(user_id);
        res.clearCookie('pending_signup', {secure: isProduction,
        sameSite: isProduction? "none":"lax", });
        const delOtpSession = await otpModel.findOneAndDelete({pendingUserId:user_id});
        if(!delPendingUser || !delOtpSession){
          return res.status(400).json({message:'User session expired'});
        }

        const token = jwt.sign(
        {
          username: user.name,
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );
      res.cookie("user_session", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction? "none":"lax",
      });

        res.status(200).json({
          message:'OTP verified'
        });
      }
      else{
        res.status(409).json({
          message:'Wrong OTP entered'
        })
      }      
    }
    catch(err){
      console.log(err)
      res.status(400).json({
        message:'Something Went Wrong'
      })
    }
  }).post('/resend-otp', async (req,res)=>{

    try{
      if(!req.cookies.pending_signup){
        return res.status(409).send()
      };
      const user_id= req.cookies.pending_signup;
      const validOtp= Math.trunc(100000 + Math.random() * 900000);
      const hashedOtp = await bcrypt.hash(String(validOtp),10);
      const otpObj= await otpModel.findOne({pendingUserId:user_id});
      if(!otpObj) return res.status(400).json({message:"User doesn't exist"});
      otpObj.otp=hashedOtp;
      otpObj.expiresAt=new Date(Date.now()+ 10*60*1000);
      await otpObj.save();
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: otpObj.email,
        subject: "OTP",
        html: `<p>This is your OTP : ${validOtp}.</p>`,
      });
      res.status(200).send();
    }
    catch(err){
      res.status(400).send();
      console.log(err);
    }

  }).post("/log-in", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        {
          username: user.name,
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );
      res.cookie("user_session", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction? "none":"lax",
      });
      res
        .status(200)
        .json({
          message: "Login successful",
          user: { id: user._id, name: user.name },
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
    // .get("/verify", async (req, res) => {
    //   try {
    //     const token = req.cookies.user_session;
    //     if (!token) {
    //       return res.status(401).json({ authenticated: false });
    //     }
    //     jwt.verify(token, process.env.JWT_SECRET)
    //       res
    //         .status(200)
    //         .json({
    //           authenticated: true,
    //         });
        
    //   } catch (error) {
    //     res.status(401).json({ message: error.message });
    //   }
    // })
  .post("/log-out", async (req, res) => {
    try {
      const token = req.cookies.user_session;
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      res.clearCookie("user_session", {secure: isProduction,
        sameSite: isProduction? "none":"lax", });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
module.exports = router;
