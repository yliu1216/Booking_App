const express =  require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const User = require('./Models/User.js');
const Place = require('./Models/Place.js');
const Booking = require('./Models/Booking.js');
const CookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const { connected } = require('process');
const path = require('path');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const mime = require('mime-types')
require("dotenv").config();



const bcrypSalt = bcrypt.genSaltSync(12);
const jwtSecret = process.env.JWT_SECRET;
const bucketName = process.env.BUCKET_NAME;

app.use(express.json());
app.use(CookieParser());


app.use(express.json());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(CookieParser());
app.use(cors({
    credentials:true,
    origin:['http://192.168.56.1:3000', 'http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
    
     
}))


async function uploadToS3(path, originalFilename, mimetype){
    const client = new S3Client({
        region: 'us-east-2',
        credentials:{
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
        const parts = originalFilename ? originalFilename.split('.') : [];
        const ext = parts.length > 1 ? '.' + parts[parts.length - 1] : '';
        const newFilename = Date.now() + '.'+ ext;
        await client.send(new PutObjectCommand({
            Bucket:bucketName,
            Body:fs.readFileSync(path),
            Key:newFilename,
            ContentType:mimetype,
            ACL:'public-read',
        }));
     return `https://${bucketName}.s3.amazonaws.com/${newFilename}`; 
}


app.get("/test", (req, res) => {
    res.json('test ok');
});


app.get("/profile",  (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const{token} = req.cookies;
    if(token){
        try{
            jwt.verify(token, jwtSecret, {}, async (err, userData)=>{
                if(err) throw err;
                res.json(userData);
            })}catch(err){
                console.log(err);
      }
    }else{
        res.status(401).json('Token not found');
    }
})


app.post('/logout', (req, res)=>{
    res.clearCookie('token', { domain: '192.168.56.1', path: "/", sameSite: 'none', secure: true });
    res.json({ message: 'Logged out successfully' });
  });
  

app.post("/register", async(req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>(
        "connected to database for registration")).catch(err=>console.error(err));
    const {firstName, lastName, email, password} = req.body;
    try{
        const existingUser = await User.findOne({ email }).catch(err=>{console.log(err)});
        if(existingUser){
            console.log("Already registered");
            return res.status(400).json({ error: 'Email already exists' });
        }
        const userInfo = await User.create({
            firstname:firstName,
            lastname:lastName,
            email,
            password:bcrypt.hashSync(password, bcrypSalt)}).catch(err=>console.log(err));
        const token = await jwt.sign({userId:userInfo._id, email, firstname:userInfo._firstName, lastname:userInfo.lastName}, jwtSecret, {});
        res.cookie('token', token, {sameSite:'none', secure: true}).status(201).json({id:userInfo._id});
    }catch(err){
        console.error(err);
        res.status(500).json('error');
    }
})


app.post('/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const {email, password} = req.body;
    try{
        const userDoc = await User.findOne({email: email}).catch(err=>console.error(err));
        console.log(userDoc);
        if(userDoc){
            const validPass  = bcrypt.compareSync(password, userDoc.password);
            if(validPass){
                    await jwt.sign({userId: userDoc._id, email:userDoc.email, firstname:userDoc.firstname}, jwtSecret, {}, (err, token) => {
                    if(err) throw err;
                    res.cookie('token', token, {sameSite:"none", secure:true}).json(userDoc);
                });
            }else {
                res.status(422).json('password invalid');
            }
        }else {
            res.status(422).json('User cannot found');
        }
    }catch(err){
        console.log(err);
    }
})


app.post('/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const { token } = req.cookies;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    } = req.body;
  
    if (token) {
      try {
        const userData = await jwt.verify(token, jwtSecret);
        console.log(userData);
        const placeDoc = await Place.create({
          owner: userData.userId,
          title: title,
          address: address,
          photos: addedPhotos,
          description: description,
          perks: perks,
          extraInfo: extraInfo,
          checkIn: checkIn,
          checkOut: checkOut,
          price: price,
          maxGuests: maxGuests
        });
  
        console.log(placeDoc);
        res.json(placeDoc);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create place" });
      }
    } else {
      res.status(401).json('Token not found');
    }
  });



  app.get('/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const { token } = req.cookies;
    try {
      jwt.verify(token, jwtSecret, {}, async (err, placeData) => {
        if (err) throw err;
        const { userId } = placeData;
        const places = await Place.find({owner:userId});
        console.log(places);
        res.json(places);
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/all-places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
   res.json(await Place.find());
})


app.get('/places/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const{id} = req.params;
    try {
        const dataDoc = await Place.findById(id);
        res.json(dataDoc);
    }catch(err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


  
app.put('/places', (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const {token} = req.cookies;
    const {
        id, title,address,addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      } = req.body;
    try{
        jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
            if(err) throw err;
            const placeDoc = await Place.findById(id);
            console.log(userData);
            const Id = userData.userId;
            const placeId = placeDoc.owner.toString();
            console.log(Id);
            console.log(placeId);


            if(Id === placeId){
                placeDoc.set({
                    title,address,photos:addedPhotos,description,
                    perks,extraInfo,checkIn,checkOut,maxGuests,price,
                  });
                  await placeDoc.save();
                  res.json('ok');
            }else{
                res.status(404).json({error:"Cannot find id that match user"});
            }
        })
    }catch(err){
        res.status(500).json({ error: "Internal server error, token does not exist or is invalid"});
    }
})


app.post('/upload-by-link', async (req, res) => {
      
    try {
      const { link } = req.body;
      const newName = 'photo' + Date.now() + '.jpg';
      const imagePath = '/tmp/' + newName;
  
      await imageDownloader.image({
        url: link,
        dest: imagePath,
      });
  
      const url = await uploadToS3(imagePath, newName, mime.lookup(imagePath));
      res.json(url);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image from link' });
    }
  });

/*
app.post('/upload-by-link', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
  try {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest:'/tmp/'+newName,
      //dest: path.join(__dirname, 'uploads', newName),
    });
    const url=await uploadToS3('/tmp/'+newName, newName, mime.lookup('/tmp/'+newName));
    //const { filename } = await imageDownloader.image(options);
    
    // Extract the relative path from the filename
  //  const relativePath = filename.replace(__dirname, '').replace(/\\/g, '/');
    
   // console.log(relativePath);
    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image from link' });
  }
});
*/

const middleware = multer({ dest: '/tmp' });

app.post('/upload', middleware.array('photos', 120), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    try {
      const uploadedFiles = [];
      for (let i = 0; i < req.files.length; i++) {
        const { path, originalname, mimetype } = req.files[i];
        const url = await uploadToS3(path, originalname, mimetype);
        uploadedFiles.push(url);
    


        /*
        const parts = originalname ? originalname.split('.') : [];
        const ext = parts.length > 1 ? '.' + parts[parts.length - 1] : '';
        const newFilename = 'photo' + Date.now() + ext;
        const newPath = path + ext;
        const destinationPath = 'uploads/' + newFilename; // Updated destination path
        fs.renameSync(path, newPath);
        fs.renameSync(newPath, destinationPath);
        uploadedFiles.push(destinationPath); // Store the image filename
        */

      }
      res.json(uploadedFiles);
      // Generate the URLs for the uploaded images
      // Replace with your server's base URL
      //const uploadedUrls = uploadedFiles.map((filename) =>  '/' + filename);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });


  app.post('/booking', async(req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const{id} = req.params;
    const{place, checkIn, checkOut, firstName, lastName, phone, numberOfGuests, price} = req.body;
    try{
        const existingBooking = await Booking.findOne({ checkIn }).catch(err=>{console.log(err)});
        if(existingBooking){
            console.log("Already Booked");
            return res.status(400).json({ error: 'This place is booked during that time' });
        }
        const bookingInfo = await Booking.create({
            place:place,
            checkin:checkIn,
            checkout:checkOut,
            phone:phone,
            firstname:firstName,
            lastname:lastName,
            price:price,
            numberofguests:numberOfGuests
            
        }).catch(err=>console.log(err));
        res.json(bookingInfo);
        console.log("booked successfully");
    }catch(err){
        console.error(err);
        res.status(500).json('Internal server error');
    }
  })

app.get("/booking/:id", async(req, res)=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    const{id} = req.params;
    console.log(id);
    try{
        const bookedInfo = await Booking.findById(id);
        res.json(bookedInfo);
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
})

app.get('/booking', async(req, res) => {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connnected to database");
    }).catch(err => console.log(err));
    try{
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            res.json( await Booking.find({user:userData.id}).populate('place') );
        })
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
})

app.listen(4000, ()=>{
    console.log("Server is listening on port");
});