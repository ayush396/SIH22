// git checkout -b balkar
// git push -u origin balkar
require("dotenv").config()

const express = require("express");
var cron = require('node-cron');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const alert = require("alert");
var nodemailer = require('nodemailer');
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.jwt_secret;
const findOrCreate = require('mongoose-findorcreate');
const { json } = require("body-parser");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: "mynewsecret",
  resave: false,
  saveUninitialized: false
}));


var today = new Date();
var year = today.getFullYear();
console.log(year);

var leap;
var i = 0;
if (year % 4 == 0) {
  if (year % 100 == 0) {
    if (year % 400 == 0)
      leap = true;
    else
      leap = false;
  } else
    leap = true;
} else
  leap = false;

console.log(leap);

app.use(passport.initialize());
app.use(passport.session());
// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://sukhbir_13:abcd@cluster0.9p3kj.mongodb.net/lilearn?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



app.use(express.urlencoded({
  extended: false
}));

const teacherSchema = new mongoose.Schema({
  email:String,
  password:String,
  fname:String,
  lname:String,
  dob:String,
  designation:String,
  reminder:{
    type: [String],
    index: true,
    unique: false
  },
  school:String,
  city:String,
  state:String,
  links:[],
  img:
   {
       data: Buffer,
       contentType: String
   },
  teacherID:Number,
  classes: {
      type: [String],
      unique: false
    }
});


const officialSchema = new mongoose.Schema({
  email:String,
  password:String,
  fname:String,
  lname:String,
  dob:String,
  designation:String,
  
  img:
   {
       data: Buffer,
       contentType: String
   },
   links:[],
  officialID:Number,
    class: {
      type: [Number],
      index: true,
      unique: false
    }
});
const userSchema = new mongoose.Schema({

  parentEmail:String,
  email: String,
  parentEmail:String,
  password: String,
  fname: String,
  lname: String,
  city: String,
  state:String,
  school:String,
  dob: String,
  gender: String,
  contact: String,
  flag: Number,
  marks:[],
  class:{type:String, default:'1A'},
  thought:Number,
	username:String,
  studentID:{type:Number, default:4000},
  teacherID:{type:Number, default:200},
  links:[],
  googleId: String,
  facebookId: String,
  githubId: String,
  confirmed:{
      type:Boolean,
      default:false
  }
});
const scoreSchema = {
  fname: String,
  lname: String,
  count: Number,
  email: String,
  score: Number,
  school:String,
  city:String,
  state:String,
  studentID:Number,
  January: {
    type: [Number],
    index: true,
    unique: false
  },
  February: {
    type: [Number],
    index: true,
    unique: false
  },
  March: {
    type: [Number],
    index: true,
    unique: false
  },
  April: {
    type: [Number],
    index: true,
    unique: false
  },
  May: {
    type: [Number],
    index: true,
    unique: false
  },
  June: {
    type: [Number],
    index: true,
    unique: false
  },
  July: {
    type: [Number],
    index: true,
    unique: false
  },
  August: {
    type: [Number],
    index: true,
    unique: false
  },
  September: {
    type: [Number],
    index: true,
    unique: false
  },
  October: {
    type: [Number],
    index: true,
    unique: false
  },
  November: {
    type: [Number],
    index: true,
    unique: false
  },
  December: {
    type: [Number],
    index: true,
    unique: false
  },
  Star: {
    type: [Number],
    index: true,
    unique: false
  },
  Pie: {
    type: [Number],
    index: true,
    unique: false
  },
  maths:{
    time:{
      type:Number,
      default:0
    },
    count:{
      type:Number,
      default:0
    },
    isdone:{
      type:Number,
      default:false
    }
  },
  english:{
    time:{
      type:Number,
      default:0
    },
    count:{
      type:Number,
      default:0
    },
    isdone:{
      type:Number,
      default:false
    }
  },
  cognitive:{
    time:{
      type:Number,
      default:0
    },
    count:{
      type:Number,
      default:0
    },
    isdone:{
      type:Number,
      default:false
    }
  }
};
const parentSchema=new mongoose.Schema({
  email:String,
  password:String,
  children:[]
});

const Score = new mongoose.model("Score", scoreSchema);
const Parent = new mongoose.model("Parent",parentSchema);
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Teacher = new mongoose.model("Teacher", teacherSchema);
const Official = new mongoose.model("Official", officialSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



var gfname="";
passport.use(new GoogleStrategy({
  clientID: process.env.google_client,
  clientSecret: process.env.google_secret,
    callbackURL: "https://www.lillearn.com/auth/google/final",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
     console.log(profile);
    gfname=profile.name.givenName;
          User.findOne({username:profile.emails[0].value},function(err,foundUser){
if(!err){
        if(foundUser){
return cb(null,foundUser);
        }


        else
        {

    User.findOrCreate({
      username: profile.emails[0].value,
      googleId: profile.id,
      email: profile.emails[0].value,
      lname: profile.name.familyName,
      fname: profile.name.givenName
    }, function(err, user) {
      return cb(err, user);
    } );
        } }
  } ) ;
  }  )    );







// passport.use(new FacebookStrategy({
//     clientID: "228431839468988",
//     clientSecret: "7a7dcdf037c45e16694897737284b631",
//     callbackURL: 'http://localhost:3000/auth/facebook/final',
//     profileFields: ['id', 'displayName', 'email', 'name', 'gender']
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//      console.log(profile.emails);
//     User.findOrCreate({
//       username: profile.id,
//       facebookId: profile.id,
//       fname: profile.name.givenName,
//       lname: profile.name.familyName,
//       email: profile.emails[0].value
//     }, function(err, user) {
//       return cb(err, user);
//     });
//   }));
//
//

var facefname="";
  passport.use(new FacebookStrategy({
    clientID:process.env.face_client,
    clientSecret: process.env.face_secret,
    callbackURL: 'https://www.lillearn.com/auth/facebook/final',
    profileFields:['id','displayName','email','name','gender']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    console.log(profile.emails[0].value)
    facefname=profile.name.givenName;
    User.findOrCreate({
      username:profile.emails[0].value,
      facebookId: profile.id,
      fname:profile.name.givenName,
      lname:profile.name.familyName,
      email:profile.emails[0].value
    }, function(err, user) {
      return cb(err, user);
    });
  }));

  app.get("/alpha",function(req,res){
    res.sendFile(__dirname+"/alphabets.html");
  });
  app.get("/number",function(req,res){
    res.sendFile(__dirname+"/numbers.html");
  });
  app.get("/shape",function(req,res){
    res.sendFile(__dirname+"/shapes.html");
  });
  app.get("/transport",function(req,res){
    res.sendFile(__dirname+"/transports.html");
  });
  app.get("/occupation",function(req,res){
    res.sendFile(__dirname+"/occupations.html");
  });
  app.get("/fruit",function(req,res){
    res.sendFile(__dirname+"/fruits.html");
  });
  app.get("/veg1",function(req,res){
    res.sendFile(__dirname+"/veg1.html");
  });
  app.get("/veg2",function(req,res){
    res.sendFile(__dirname+"/veg2.html");
  });
  app.get("/multi",function(req,res){
    res.sendFile(__dirname+"/multiply.html");
  });
  app.get("/addition",function(req,res){
    res.sendFile(__dirname+"/addition.html");
  });
  app.get("/subtraction",function(req,res){
    res.sendFile(__dirname+"/subtraction.html");
  });
  app.get("/animal",function(req,res){
    res.sendFile(__dirname+"/animal.html");
  });
  app.get("/solar",function(req,res){
    res.sendFile(__dirname+"/solar.html");
  });
  app.get("/body",function(req,res){
    res.sendFile(__dirname+"/body.html");
  });
  app.get("/uploadCSV",function(req,res){
    res.sendFile(__dirname+"/csv.html");
  });
  app.post("/csv",function(req,res){
    // console.log("inside");
    res.send("Success");
    // console.log(req.body.csv);
  });

var link_list=[
"https://www.youtube.com/embed/hq3yfQnllfQ",
"https://www.youtube.com/embed/YgCNHOgJv3I",
"https://www.youtube.com/embed/BY5TkXOk2kQ",
"https://www.youtube.com/embed/mjlsSYLLOSE",
"https://www.youtube.com/embed/Rnw5ixvU074",
"https://www.youtube.com/embed/BchpGkLvTy8",
"https://www.youtube.com/embed/BZf6frPNrhg",
"https://www.youtube.com/embed/wKfrbnRRD-k",
"https://www.youtube.com/embed/1rWGNEkvGMY",
"https://www.youtube.com/embed/DOT15xaX7-E",
"https://www.youtube.com/embed/WS6AIG7q148",
"https://www.youtube.com/embed/hewioIU4a64",
"https://www.youtube.com/embed/i5aXwiC3wWc",
"https://www.youtube.com/embed/RJ2bQWH6GCM",
];
app.get("/lessons",function(req,res){
  console.log(req.query.vid);
  var v=req.query.vid;
  v=link_list[v];
  // <iframe width="100%" height="550" id="vid" src="https://www.youtube.com/embed/hq3yfQnllfQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  link_='<iframe width="100%" height="550" id="vid" src="'+v+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  res.render("alphabets",{link:v});
  // res.sendFile(__dirname+"/alphabets.html");
});

app.get("/auth/facebook",
  passport.authenticate('facebook', {
    scope: ['email']
  }));

app.get("/auth/facebook/final",
  passport.authenticate('facebook', {
    failureRedirect: "/login"
  }),
  function(req, res) {
    console.log(req.user, req.isAuthenticated());
    res.render("welcome",{fname:facefname});
  });
  app.get("/teacherDashboard",function(req,res){
    res.sendFile(__dirname + "/teacherDashboard.html");
  });
  

app.get("/addStudent",function(req,res){
  var t_id=req.query.teacherID;
  t_id=parseInt(t_id);

  User.find({teacherID:200},(err,found)=>{
    Teacher.findOne({teacherID:t_id},(er,f)=>{
      if (err) {
        
      }
      var l=f.classes;
      res.render("AddStudent",{list:JSON.stringify(found),tlist:l});
    })
  });

  
}); 
app.get("/test_link",(req,res)=>{
  console.log(req.query.officalID);
  Official.findOne({officialID:parseInt(req.query.officalID)},(err,found)=>{
    if(!err){
    res.render("test_link",{idd:parseInt(found.officialID),p:found.links});
    }
  })
  
});
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.post("/success",function(req,res){
  res.send("Message Sent Successfully");
  var stud_id=req.query.stud_id;
  var remarks=req.body.remarks;
  User.find({studentID:parseInt(stud_id)},(err,found)=>{
            if(err){
              console.log(err);
            }else{
              var tid=found[0].teacherID;
              Teacher.findOne({teacherID:parseInt(tid)},(err,f)=>{
                tEmail=f.email;
               console.log(tEmail);

              var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'lillearn.13@gmail.com',
                  pass: 'oqkwpkvybwqmmbfj'
                }
              });

              var mailOptions = {
                from:"Team Lil-learn",
                to:tEmail,

                subject: 'Child Remarks',
                text: remarks

              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            })
            }
          });


})

app.post("/success_t",function(req,res){
  res.send("Message Sent Successfully");
  var stud_id=req.body.stud_id;
  console.log(stud_id);
  var remarks=req.body.remarks;
  User.find({studentID:parseInt(stud_id)},(err,found)=>{
            if(err){
              console.log(err);
            }else{
              var pEmail=found[0].parentEmail;
              console.log(pEmail);

              var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'lillearn.13@gmail.com',
                  pass: 'oqkwpkvybwqmmbfj'
                }
              });

              var mailOptions = {
                from:"Team Lil-learn",
                to:pEmail,

                subject: 'Child Remarks',
                text: remarks

              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              
            }
          });



})


app.get("/auth/google",
  passport.authenticate('google', {
    scope: ['profile', 'email']

  })
);

// const newTeacher = new Teacher(
//   {
//     email:"sample@teacher.com",
//     password:"12345",
//     fname:"Rajesh",
//     lname:"Arora",
//     subject:"Science",
//     studentID:4000,
//   });




app.get("/auth/google/final",
  passport.authenticate('google', {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.render("welcome", {
      fname: gfname
    });
  });

app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/landing.html");
});

app.get("/teacher", function(req, res) {
  res.sendFile(__dirname + "/teacher.html");
});
app.get("/officials", function(req, res) {
  // const newoffical = new Official(
  //   {
  //     email:"sample@offical.com",
  //     password:"123",
  //     fname:"Bahuballi",
  //     lname:"Singh",
  //     officialID:420,
  //     designation:"Offical"
  //   });
  //   newoffical.save();
  res.sendFile(__dirname + "/officials.html");
});

app.get("/student", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/parent", function(req, res) {
  res.sendFile(__dirname + "/parent.html");
});


app.get("/student", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});
app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/newSignup.html");
});


app.get("/final", function(req, res) {
  res.render("welcome", {
    username: "nknd"
  });
});

// app.get("/stats",(req,res)=>{
//   var t_id=req.query.teacherID;
//   var l=[];
//   Teacher.findOne({teacherID:t_id},(err,found)=>{
//     if(err){
//       console.log(err);
//     }else{
//       l=found.classes;
//       User.find({teacherID:t_id},(err,found)=>{
//         if(err){
//           console.log(err);
//         }else{
//           // console.log(l);
//           // console.log(found);
          
//           res.render("stats",{p:JSON.stringify(found),cl:l});
//         }
//       });
//     }
//   });
// });

//Update Values in MongoDB server after 24 hours
var x=0;
// Score.updateMany({},{$set:{"math.count":0,"english.count":0,"cognitive.count":0}},(err,o)=>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Done");
//   }
// })
cron.schedule('0 0 * * *', () => {
  console.log('running when days changes');
  x=(x+1)%70;
  Score.updateMany({},{$set:{"maths.isdone":false,"english.isdone":false,"cognitive.isdone":false}},(err,o)=>{
    if(err){
      console.log(err);
    }else{
      console.log("Done");
    }
  })
});


app.post("/teacher_login",function(req,res){
 
  Teacher.findOne({username:req.body.username},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(!found){
        res.send("No account with these credentials");
      }else{
        if(found.password===req.body.password){
          teachid=found.teacherID;
          console.log(teachid);
          // console.log("Here is the list");
          // console.log(found.links);
          l=found.classes;
          User.find({teacherID:teachid},(err,found2)=>{
          if(err){
            console.log(err);
          }else{
            // console.log(l);
            // console.log(found);
            res.render("teacherDashboard",{fname:found.fname,lname:found.lname,idd:teachid,p:JSON.stringify(found2),cl:l});
            // res.render("stats",{});
          }
        });
          
        }else{
          res.send("Wrong Password");
        }
      }
    }
  })
})

app.post("/officials_login",function(req,res){

  var oname=req.body.oname;
  console.log(oname);

  
  
  Official.findOne({username:req.body.username},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(!found){
        res.send("No account with these credentials");
      }else{
        var st=found.state;
        console.log(found);
        if(found.password==req.body.password){
          if(oname=="center"){
            // Score.find({},(err,f)=>{
            //   if(!err){
            //     res.render("center",{fname:found.fname,lname:found.lname,idd:found.officialID,stud:JSON.stringify(f)});
            //   }
            // })
            res.render("center",{fname:found.fname,lname:found.lname,idd:found.officialID});
          }else{
            res.render("state",{fname:found.fname,lname:found.lname,idd:found.officialID});
          }
         }else{
          // console.log(found.password);
          res.send("Wrong Password");
        }
      }
    }
  })
})
app.get("/teacher_tests",(req,res)=>{
  var t_id=req.query.teacherID;
  
  Teacher.findOne({teacherID:t_id},(err,found)=>{
    if(err){
      console.log(err);
    }else{
      res.render("teacher_links",{p:found.links,idd:t_id});
    }
  });

});
app.post("/add_test",function(req,res){
  const retrivedList=req.body.list;
  var jsonListitems = JSON.parse(retrivedList);
  console.log(JSON.parse(retrivedList));  
  const official_id=parseInt(req.body.tid);
 
  jsonListitems.map((item) => {
      Teacher.findOne({teacherID :item.at},function(err,found){
        
        if(err){
          console.log(err);
        }else{
          if(!found){
            console.log("No Teacher Found");
            // res.send("No Teacher Found");
          }
          
          else{
            var q=found.links;
            var flag=0;
            console.log(q);
            q.map(entry=>{
              if(entry.l===item.bt){
                flag=1;
              }
            })
            if(flag===1){
              console.log("already sent");
            }else{
              console.log(item.at);
            var l=item.bt, time=item.ct,ll=item.at;
            Teacher.update({teacherID:item.at},{$push:{links:{$each:[{l,time}],$sort:{time :-1}}}},function(err,doc){
              if(err){
                console.log(err);
              }else{
                // console.log(official_id);
                console.log("Updated")
                
              }
            })

            Official.update({officialID:official_id},{$push:{links:{$each:[{ll,l,time}],$sort:{time :-1}}}},function(err,doc){
              if(err){
                console.log(err);
              }else{
                console.log("Updated");
              }
            })
            }
            
          }
        }
      })
  })
  Official.findOne({officialID:official_id},(err,found)=>{
    if(!err){
      res.render("test_link",{idd:parseInt(found.officialID),p:found.links});
    }
  });
})

app.post("/delete_link",(req,res)=>{
  var link=req.body.link;
  var o_id=req.body.off_id;
  console.log(link+"    "+o_id);
  Official.updateMany({officialID:parseInt(o_id)},{$pull:{links:{l:link}}},function(err,obj){
    if(err){
      console.log(err);
    }else{
      console.log("In Official");
      console.log(obj);
    }
  })
  Teacher.updateMany({officialID:parseInt(o_id)},{$pull:{links:{l:link}}},function(err,obj){
    if(err){
      console.log(err);
    }else{
      console.log("In teacher");
      console.log(obj);
    }
  })
  Teacher.find({officialID:parseInt(o_id)},(err,found)=>{
    if(err){
      console.log("err");
    }else{
      User.updateMany({teacherID:parseInt(found.teacherID)},{$pull:{links:{link:link}}},function(err,obj){
        if(err){
          console.log(err);
        }else{
          console.log("In Student");
          console.log(obj);
        }
      })
    }
  });
  Official.findOne({officialID:parseInt(o_id)},(err,found)=>{
    if(!err){
    // console.log(found);
    res.render("test_link",{idd:found.officialID,p:found.links});
    }
  });
  // res.send("Hello");
});

app.post("/send_to_student",(req,res)=>{
  var link=req.body.link;
  var times=req.body.time;
  var tid=req.query.teacherID;
  var currentdate = new Date();
    var time =  currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + "  "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
  console.log(tid);
  console.log(time);
  User.update({teacherID:parseInt(tid) },{$push:{links:{$each:[{link,time}]}}},function(err,doc){
    if(err){
      console.log(err);
    }else{
      console.log("Updated");
    }
  });
    res.redirect("/teacher_tests?teacherID="+tid);
})
app.post("/add",function(req,res){
  const retrivedList=req.body.student_list;
  var jsonListitems = JSON.parse(retrivedList);
  console.log(JSON.parse(retrivedList));  
  
  const teachid=req.body.tid;
  const classs=req.body.classs;
  // console.log();
  jsonListitems.map((item) => {
    if(item.dt!==0){
      User.updateOne({studentID:parseInt(item.at)},{teacherID: parseInt(teachid),class:classs},function(err,doc){
        if(err){
          console.log(err);
        }else{
          console.log(doc);
          console.log("Updated");
        }
    })
    }
  })
  Teacher.findOne({username:parseInt(teachid)},function(err,found){
    if(err){
      console.log(err);
    }else{
          l=found.classes;
          User.find({teacherID:teachid},(err,found2)=>{
          if(err){
            console.log(err);
          }else{
            res.render("teacherDashboard",{fname:found.fname,lname:found.lname,idd:teachid,p:JSON.stringify(found2),cl:l});
          }
        });
          
      
    }
  })
})
// sample@teacher.com
// 12345


// app.post("/parent_login", function(req,res){
//      var mail;
//      User.findOne({parentEmail:req.body.username},(err,found)=>{
      
//       if(err){
//         console.log(err);
//       }else{

//         if(found){
//           mail= found.email;
//           console.log(mail+" inhbfb");
//           const user = new User({
//             username: mail,
//             // studentID:found.studentID,
//             // teacherID:found.teacherID,
//             // confirmed:true,
//             // _id:found._id
//             password: req.body.password
//           });
          
//           req.login(user, function(err) {
//             if (err) {
//               console.log(err);
//               console.log("ERRORS");
//             } else {
//               console.log(user);
//               passport.authenticate("local")(req, res, function() {
//                 console.log("SUCCESS");
//               });
//             }
//           });
//         }else{
//           console.log("No data found");
//           res.send("abc");
//         }
//       }
//     });
//     // console.log(mail);
    
// })


app.post("/kidids",(req,res)=>{
  const n=req.body.username,pass= req.body.password;
  console.log(n);
  Parent.findOne({email:n},(err,found)=>{
    if(err){
      console.log("Error Logging In");
    }else{
      if(!found){
        console.log("No Child have account");
        res.send("No Child have account");
      }else{
        if(found.password!==pass){
          console.log("Wrong Password");
          res.send("Wrong password");
        }else{
          User.find({parentEmail:n},(err,f)=>{
            console.log("hello");
            console.log(f);
            res.render("kidProfile",{profiles:JSON.stringify(f)});
          })
        }
      }
    }
  })
})

app.get("/parent_login", function(req, res) {
  
  const studID=req.query.id;
  let Fname
  let lname;
  let gender;
  let stud_ID;
  let dateofbirth;
  let teach_ID;

  User.find().sort('-studentID').exec((err,doc)=>{
    m=doc[0].studentID;
    console.log(m);
  })
 
  Score.findOne({studentID: studID}, function(err, foundUser) {
    if (err) {
      console.log(err);
      console.log("ERRORS IN LOGGING IN");
    } else {

      if (foundUser) {
        Score.find({},(eror,ff)=>{

          console.log(foundUser.score);
          console.log(foundUser.fname);
          console.log(foundUser.lname);
          User.findOne({studentID:studID},(err,found2)=>{
            if (err) {
              console.log(err);
              console.log("ERRORS IN LOGGING IN");
            } else {
                Fname=found2.fname;
                lname=found2.lname;
                gender=found2.gender;
                dateofbirth=found2.dob;
                stud_ID=found2.studentID;
                teach_ID=found2.teacherID;
                Teacher.findOne({teacherID:teach_ID},function(err,found3){
                  if(err){
                    console.log(err);
                  }else{
                    var tname=found3.fname;
                    var tlname=found3.lname;
                    res.render("parent", {
            
                      username: foundUser.email,
                      score: JSON.stringify(foundUser),
                      leader:JSON.stringify(ff),
                      fname: "Parent",
                      name:Fname+lname,
                      gender:gender,
                      dob:dateofbirth,
                      id:stud_ID,
                      teacherName:tname+' '+tlname,
                    
                    });
                  }
                  
                })
                
                

            }

          })
         
      })
  }
  }});

});
                 

app.post("/login", function(req, res) {
  const username = req.body.username;
  console.log(username);
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  console.log(user);
  User.find().sort('-studentID').exec((err,doc)=>{
    m=doc[0].studentID;
    console.log(m);
  })
  User.findOne({username:req.body.username}, function(err,found){
      if(err){
        console.log(err);
        console.log("ERRORS IN LOGGING IN");
      }else{
          if(found){
              // console.log(found);
              if(!found.confirmed){
                  res.sendFile(__dirname+"/login3.html");
              }
              else{
                req.login(user, function(err) {
                  if (err) {

                    console.log(err);
                    console.log("ERRORS");
                  } else {
                    passport.authenticate("local")(req, res, function() {
                      console.log("SUCCESS");

                      Score.findOne({
                          email: username
                        }, function(err, foundUser) {
                          if (err) {
                            console.log(err);
                            console.log("ERRORS IN LOGGING IN");
                          } else {
                            if (foundUser) {

                              console.log(foundUser.score);
                              console.log(foundUser.fname);
                              console.log(foundUser.lname);
                              res.render("welcome", {
                                  username: username,
                                  score: foundUser.score,
                                  fname: foundUser.fname,
                                  lname:foundUser.lname,
                                  gender:foundUser.gender,
                                  dob:foundUser.dob,
                                });

                            }
                          }
                        });

                    });
                  }
                });

              }
          }
	      else
	      {
          console.log("hi");
          res.sendFile(__dirname+"/login4.html");
	      }
      }
  });
  // Score.findOne({
  //   email: username
  // }, function(err, foundUser) {
  //   if (err) {
  //     console.log(err);
  //     console.log("ERRORS IN LOGGING IN");
  //   } else {
  //     if (foundUser) {
  //
  //       console.log(foundUser.score);
  //       console.log(foundUser.fname);
  //       console.log(foundUser.lname);
  //       console.log(foundUser.gender);
  //       console.log(foundUser.dob);
  //
  //
  //       res.render("welcome", {
  //         username: username,
  //         score: foundUser.score,
  //         fname: foundUser.fname,
  //         lname: foundUser.lname,
  //         gender: foundUser.gender,
  //         dob: foundUser.dob,
  //       });
  //     }
  //   }
  // });
});

app.post("/login1", function(req, res) {
  const pass1 = req.body.password;
  const pass2 = req.body.password2;
  if (pass1 === pass2) {
    res.sendFile(__dirname + "/login1.html");
  } else {
    res.send("Password does not match");
    res.sendFile(__dirname + "/reset-password.html")
  }
})
app.post("/signup",  function(req, res) {
      // const fname = req.body.fname;
      // console.log(req.body.fname);
      // console.log(req.body.lname);
      // console.log(req.body.email);
      // console.log(req.body.password);
      // console.log(req.body.dob);
      // console.log(req.body.gender);
      // console.log(req.body.cnumber);
      // console.log(req.body.city);
      
       User.find().sort('-studentID').exec((err,doc)=>{
        m=doc[0].studentID + 1;
        console.log(m);
      
      User.findOne({
      username: req.body.email
          }, function(err, found) {
            if (!err) {
              if (found) {

                res.sendFile(__dirname+"/newSignup.html")
              }
               else {

                 User.register({
                   username: req.body.email,
	                 email:req.body.email,
                   fname: req.body.fname,
                   lname: req.body.lname,
                   dob: req.body.dob,
                   gender: req.body.gender,
                   contact: req.body.cnumber,
                   studentID:m,
                   parentEmail:req.body.parent_email,
                   city: req.body.city,
                   flag: 0,
                   thought:x,
                 }, req.body.password, function(err, user) {
                   if (err) {
                     console.log(err);



                   } else {
                     passport.authenticate("local")(req, res, function() {
                       console.log("New User");
                     });
                     // res.render("final");

                   }
                 });
                //  abcde
                var passw=Math.floor((Math.random()*1000000)+1);
                const pp=new Parent({
                  email:req.body.parent_email,
                  password:"12345",
                  children:[req.body.email]
                })
                
                Parent.findOne({email:req.body.parent_email},(err,ff)=>{
                  if(err){
                    console.log(err);
                  }else{
                    if(ff){
                      var mail=req.body.email;
                      Parent.update({email:ff.email},{$push:{children:{$each:[mail]}}},(err,doc)=>{
                        if(err){
                          console.log("No parent push");
                        }else{
                          console.log("Successful parent push");
                        }
                      })
                      Teacher.update({teacherID:item.at},{$push:{links:{$each:[{l,time}],$sort:{time :-1}}}},function(err,doc){
                        if(err){
                          console.log(err);
                        }else{
                          // console.log(official_id);
                          console.log("Updated")
                          
                        }
                      })
                    }else{
                      pp.save(()=>{
                        if(err){
                          console.log("no parent added");
                        }
                      })
                    }
                  }
                })

                   const newScore = new Score({
                   email: req.body.email,
                   fname: req.body.fname,
                   score: 0,
                   count: 0,
                   lname: req.body.lname,


                 });
                 for (i = 1; i <= 31; i++) {
                   newScore.January.unshift(0);
                 }



                 if (!leap) {
                   for (i = 1; i <= 28; i++) {
                     newScore.February.unshift(0);
                   }
                 } else {
                   for (i = 1; i <= 29; i++) {
                     newScore.February.unshift(0);
                   }
                 }
                 for (i = 1; i <= 31; i++) {
                   newScore.March.unshift(0);
                 }
                 for (i = 1; i <= 30; i++) {
                   newScore.April.unshift(0);
                 }
                 for (i = 1; i <= 31; i++) {
                   newScore.May.unshift(0);
                 }
                 for (i = 1; i <= 30; i++) {
                   newScore.June.unshift(0);
                 }
                 for (i = 1; i <= 31; i++) {
                   newScore.July.unshift(0);
                 }
                 for (i = 1; i <= 31; i++) {
                   newScore.August.unshift(0);
                 }
                 for (i = 1; i <= 30; i++) {
                   newScore.September.unshift(0);
                 }
                 for (i = 1; i <= 31; i++) {
                   newScore.October.unshift(0);
                 }
                 for (i = 1; i <= 30; i++) {
                   newScore.November.unshift(0);
                 }
                 for (i = 1; i <= 31; i++) {
                   newScore.December.unshift(0);
                 }
                 for (i = 1; i <= 5; i++) {
                   newScore.Star.unshift(0);
                 }
                 for (i = 1; i <= 7; i++) {
                   newScore.Pie.unshift(0);
                 }

                 newScore.save(function(err) {
                   if (err)
                     console.log("ERRORS IN SCORE");
                   else
                     console.log("SUCCESS SCORE");
                 });

                 User.findOne({
                     username: req.body.email
                   }, function(err, found) {
                     if (!err) {
                         console.log(found);
                         const secret = jwt_secret + req.body.email;
                         const payload = {
                           email: req.body.email,
                           _id: req.body.fname
                         }
                         const token = jwt.sign(payload, secret, {
                           expiresIn: '1d'
                         })
                         const link = `https://www.lillearn.com/confirmation/${req.body.email}/${token}`;
                         console.log(link);

                         var transporter = nodemailer.createTransport({
                             service: 'gmail',
                             auth: {
                               user: 'lillearn.13@gmail.com',
                               pass: 'oqkwpkvybwqmmbfj'
                             }
                           });

                           var mailOptions = {
                             from:"Team Lil-learn",
                             to:req.body.email,

                             subject: 'Confirm your email',
                             text: link

                           };

                           transporter.sendMail(mailOptions, function(error, info) {
                             if (error) {
                               console.log(error);
                             } else {
                               console.log('Email sent: ' + info.response);
                             }
                           });

                     } else {
                       console.log(err);
                     }
                   })
                 res.sendFile(__dirname + '/login2.html'); console.log("new");
              }
            } else {
              console.log(err);
            }
          });


      });
    })
      app.get("/thankyou", function(req, res) {
      res.sendFile(__dirname + ('/thankyou.html'))
    })

    app.post("/check", function(req, res) {
      const username = req.body.username;
      User.findByUsername(username).then(function(sanitizedUser) {
        if (sanitizedUser) {
          const secret = jwt_secret + sanitizedUser.salt + sanitizedUser.hash;
          const payload = {
            email: sanitizedUser.email,
            _id: sanitizedUser._id
          }
          const token = jwt.sign(payload, secret, {
            expiresIn: '10m'
          })
          const link = `https://www.lillearn.com/reset-password/${sanitizedUser.username}/${token}`;
          console.log(link);

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'lillearn.13@gmail.com',
              pass: 'oqkwpkvybwqmmbfj'
            }
          });

          var mailOptions = {
            from: "Team Lil-learn",
            to: sanitizedUser.username,

            subject: 'Reset Your Password',
            text: link

          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          res.send(`<h1 style="text-align:center"> Password reset link is sent to your Registered Email </h1>`);

        } else {
          res.send(`<h1 style="text-align:center"> User Not Registered!! </h1>`);
        }
      }, function(err) {
        console.error(err);
      });



    });





    app.get("/goto", function(req, res) {
      res.sendFile(__dirname + "/goto.html");
    });

    app.get("/forget", function(req, res) {
      const username1 = "s@t.com";
      newPasswordString = "sukhbir";
      User.findByUsername(username1).then(function(sanitizedUser) {
        if (sanitizedUser) {
          sanitizedUser.setPassword(newPasswordString, function() {
            sanitizedUser.save();
            res.status(200).json({
              message: 'password reset successful'
            });
          });
        } else {
          res.status(500).json({
            message: 'This user does not exist'
          });
        }
      }, function(err) {
        console.error(err);
      });


    });


    app.post('/reset-password/:username/:token', (req, res, next) => {
      const {
        username,
        token
      } = req.params;
      const {
        password,
        password2
      } = req.body;
      User.findOne({
        username: username
      }, function(err, found) {
        if (!err) {
          if (!found) {
            res.send("Invalid Id");
          } else {
            // we are having a valid user with this id
            const secret = jwt_secret + found.salt + found.hash;
            try {
              const payload = jwt.verify(token, secret);
              // p1 should be equal to p2
              //we can simply find the user with payload email and id
              //

              found.setPassword(password, function() {
                //  found.save();
                res.status(200).json({
                  message: 'password reset successful'
                });
              });


              res.send("Password updated, you can login now");
            } catch (error) {
              console.log(error.message);
              res.send(error.message);
            }
          }
        } else {
          console.log(err);
        }
      })
    });



    app.get("/reset-password/:username/:token", function(req, res) {
      const {
        username,
        token
      } = req.params;
      // check if this id exist in data base
      User.findOne({
        username: username
      }, function(err, found) {
        if (!err) {
          if (!found) {
            res.send("Invalid Id");
          } else {
            // we are having a valid user with this id
            const secret = jwt_secret + found.salt + found.hash;
            try {
              const payload = jwt.verify(token, secret);
              res.sendFile(__dirname + '/reset-password.html')

            } catch (error) {
              console.log(error.message);
              res.send(error.message);
            }
          }
        } else {
          console.log(err);
        }
      })
      // res.send(req.params);
    });


    let videos=['https://www.youtube.com/embed/w36yxLgwUOc?start=5',
'https://www.youtube.com/embed/2iXqoLPjSTg?start=5',
'https://www.youtube.com/embed/q1xNuU7gaAQ?start=5',
'https://www.youtube.com/embed/nCPPLhPTAIk?start=5',
'https://www.youtube.com/embed/XkQo0uxQTCI?start=5',
'https://www.youtube.com/embed/XkQo0uxQTCI?start=5',
'https://www.youtube.com/embed/s0bS-SBAgJI?start=5',
'https://www.youtube.com/embed/tzN299RpJHA?start=6',
'https://www.youtube.com/embed/q4NIEG_ygiM?start=28',
'https://www.youtube.com/embed/93BqLewm3bA?start=28',
'https://www.youtube.com/embed/9VtxCxtsMAI?start=28',
'https://www.youtube.com/embed/yZUeOF1UAk8?start=10',
'https://www.youtube.com/embed/CA6Mofzh7jo',
'https://www.youtube.com/embed/jF0Id-hH9y4?start=7',
'https://www.youtube.com/embed/24wO1G_7fyc?start=7',
'https://www.youtube.com/embed/dJpIU1rSOFY',
'https://www.youtube.com/embed/-84U1EsZCbY?start=3',
'https://www.youtube.com/embed/QLhKCr_qTJU?start=3',
'https://www.youtube.com/embed/5tC8OOxOFEk?start=2',
'https://www.youtube.com/embed/cDed5eXmngE?start=5',
'https://www.youtube.com/embed/n_OBLfdh3Ew?start=3',
'https://www.youtube.com/embed/_yH3BntZCSI?start=3',
'https://www.youtube.com/embed/Hnfdq2htoKU?start=3',
'https://www.youtube.com/embed/fephtrPt6wk?start=3',
'https://www.youtube.com/embed/MEb7nnMLcaA?start=3',
'https://www.youtube.com/embed/VSKSyZh3FOU?start=3',
'https://www.youtube.com/embed/VSKSyZh3FOU?start=3',
'https://www.youtube.com/embed/4hpCfHcIaQg?start=3',
'https://www.youtube.com/embed/p-B2y2I6duE?start=3',
'https://www.youtube.com/embed/X4fcI4PMvwg?start=5',
'https://www.youtube.com/embed/VX6BnTRq8Fs?start=3',
'https://www.youtube.com/embed/xmbpPWIV0VU?start=3',
'https://www.youtube.com/embed/PGiqxnAr2fQ?start=3',
'https://www.youtube.com/embed/9ex0syXAqd4?start=3',
'https://www.youtube.com/embed/d86DofYpkrY?start=3',
'https://www.youtube.com/embed/sM3FDsMAMdc?start=3',
'https://www.youtube.com/embed/v80w3htJNyQ?start=3',
'https://www.youtube.com/embed/470N1pxIZbk?start=5',
'https://www.youtube.com/embed/nHCKRGBxlf8?start=3',
'https://www.youtube.com/embed/09TRoxgVPjs?start=5',
'https://www.youtube.com/embed/jMW_0Ro6b5c?start=3',
'https://www.youtube.com/embed/QQsybALJoew?start=3',
'https://www.youtube.com/embed/EpuDYZ_g0yg?start=3',
'https://www.youtube.com/embed/SPQt5v5Xsg8?start=3',
'https://www.youtube.com/embed/JWPy9zhQLJw?start=3',
'https://www.youtube.com/embed/8If95999Zs0?start=3',
'https://www.youtube.com/embed/4b5ljmLvRlU?start=3',
'https://www.youtube.com/embed/nsEpiowHIbg?start=3',
'https://www.youtube.com/embed/l2GdFobEcbI?start=3',
'https://www.youtube.com/embed/PXBP0XYLMPA?start=3',
'https://www.youtube.com/embed/ZnEprHobSAA?start=3',
'https://www.youtube.com/embed/XbxsdbisXzU?start=3',
'https://www.youtube.com/embed/BQvo7vyCmuE?start=3',
'https://www.youtube.com/embed/5-2NLHB4Gxg?start=3',
'https://www.youtube.com/embed/SmsCJpBuNrE?start=3',
'https://www.youtube.com/embed/BYpfOKwlYS8?start=5',
'https://www.youtube.com/embed/OVcVSyjJkY4?start=3',
'https://www.youtube.com/embed/2HTZs51OYwo?start=3',
'https://www.youtube.com/embed/MQLadfsvfLo?start=3',
'https://www.youtube.com/embed/hpfiVCz1prk?start=3',
'https://www.youtube.com/embed/UXsomnDkntI?start=3',
'https://www.youtube.com/embed/ckULkfv3Hb0?start=3',
'https://www.youtube.com/embed/n9WrjIAUtVY?start=3',
'https://www.youtube.com/embed/QJZ-SfTiyNM?start=4',
'https://www.youtube.com/embed/7GI4eTUyGSM?start=3',
'https://www.youtube.com/embed/gfKp1z4sCIE?start=3',
'https://www.youtube.com/embed/clwt7iXF1Mg?start=3',
'https://www.youtube.com/embed/YKsNUl_s0XQ?start=5',
'https://www.youtube.com/embed/Vnj9Ay6xmOk?start=5',
'https://www.youtube.com/embed/tvCeSX9Pthw?start=3'
];



app.get("/facts",function(req,res){
  res.render('facts',{fact:videos[x]});
});





    app.get("/logout", function(req, res) {
      req.logout();
      res.redirect("/");
    });

    app.get("/confirmation/:username/:token", function(req, res) {
        const {
          username,
          token
        } = req.params;
        // check if this id exist in data base
        User.findOne({
          username: username
        }, function(err, found) {
          if (!err) {
            if (!found) {
              res.send("Invalid Id");
            } else {
              const secret = jwt_secret + found.username;
              try {
                const payload = jwt.verify(token, secret);
                console.log(found);
                User.update({username:found.username},{confirmed:true},function(err,doc){
                    if(err){ console.log(err); }
                    else{ console.log(doc); }
                })
                console.log("Hello Balkar");
                console.log(found);

                res.send(`<h1 style:"text-align:center;"> Successful You can Login now </h1>`);

              } catch (error) {
                console.log(error.message);
                res.send(error.message);
              }
            }
          } else {
            console.log(err);
          }
        })
        // res.send(req.params);
      });




      app.get("/csc", function(req, res) {
        res.sendFile(__dirname + "/csc.html");
      });



      app.post("/change_loc", function(req, res) {
        const username = req.body.username;
        const user = new User({
          username: req.body.email,
          password: req.body.password
        });



        User.findOne({username:req.body.username}, function(err,found){
            if(err){
              console.log(err);
              console.log("ERRORS IN LOGGING IN");
            }else{
                if(found){
                    if(!found.confirmed){

                        res.sendFile(__dirname+"/csc1.html");
                    }
                    else{
                      req.login(user, function(err) {
                        if (err) {
                          console.log(err);
                          res.sendFile(__dirname+"/csc1.html");

                          console.log("ERRORS");
                        } else {
                          passport.authenticate("local")(req, res, function() {
                            console.log("SUCCESS");
                            User.updateOne({username:username},{country:req.body.country},function(err,doc){
                              if(err){ console.log(err); }
                              else{
                                 console.log("con");
                                 console.log(doc); }
                            })
                            User.updateOne({username:username}, {state: req.body.state},function(err,doc){
                              if(err){ console.log(err); }
                              else{
                                console.log("state");
                                console.log(doc); }
                            })
                            User.updateOne({username:username}, {city:req.body.city},function(err,doc){
                              if(err){ console.log(err); }
                              else{
                                 console.log("city");
                                 console.log(doc); }
                                 res.send(`<h1 style="text-align:center"> Your Location has been updated Successfully????. </h1>`);
                            })


                          });
                        }
                      });

                    }
                }
            }
        });



      });
      app.get("/thankyou",function(req,res){
        res.sendFile(__dirname+"/thankyou.html");
      });
    app.listen(process.env.PORT || 3000, function(req, res) {
      console.log("Server is running on ");
    });
    var t_cit=["Chennai","Madurai","Vellore"];
    var h_cit=["Panipat","kernal","Hisar"];
    var p_cit=["Bathinda","Mansa","Amritsar"];
    var H_city=["Dyal Singh Public School","GD Public School","S.D. Vidya Mandir", "Partap Public School" ,"OPS Vidya Mandir","Nishan Public School","Sant Kabir School","Holy Angel School","DAV Public School"];
    var P_city=["Oxford Public School","DAV International School","Holy Heart Presidency School","St. Xavier's School","St. Joseph's Convent Senior Secondary School","Delhi Public School","Singhal Stars School","SDKL DAV CENT. SR. SEC. PUBLIC SCHOOL","Alpine Public School"];
    var T_city=["Jeevana Public School","Queen Meera Public School","Jain Vidyalaya","DOT School of Design","St. Britto's Acadamy","Vidya Mandir School","Shree Jayam School","BMD Jain School","Sunbeam School"];
    // app.get("/extra",(req,res)=>{
    //   var i=4000,ii=0;
    //   while(i<4042){
    //     if(i%3==0){
    //       solve(i,P_city[ii]);
    //       ii++;
    //     }
    //     if(ii==9)ii=0;
    //     i++;
    //   }
    //   res.send("hi");
    // })

    // app.get("/extra",(req,res)=>{
    //   var p=0,h=0,t=0;
    //   for(var i=4000;i<4042;i++){
    //     // if(i%3==1){
    //     //   solve(i,h_cit[h],"Haryana");
    //     // }
    //      if(i%3==2){
    //       solve(i,t_cit[t],"Tamil Nadu");
    //     }
    //     // else{
    //     //   solve(i,p_cit[p],"Punjab");
    //     // }
    //   }
    // })
    // function solve(i,c,st){
      
    //   Score.updateOne({studentID:i},{$set:{city:c,state:st}},(err,doc)=>{
    //     if(!err){
    //       console.log(doc);
    //     }
    //   })
    // }

    // app.get("/extra2",(req,res)=>{
    //   var list=[];
    //   var ll=["sukhbirsingh521@gmail.com"];
    //   Score.find({},(err,found)=>{
    //     if(!err){
    //       list=found;
    //       list.forEach(e=>{
    //         ll.push(e.email);
    //       })
    //      ll.pop();
    //      ll.pop();
    //      ll.push("bsingh1_be19@thapar.edu");
    //      console.log(ll);
    //      var co=4000;
    //      ll.forEach(e=>{
    //       Score.updateOne({email:e},{$set:{studentID:co}},(err,doc)=>{
    //         if(!err){
    //           console.log(doc);
    //         }
    //       })
    //       co++;
    //      })
    //     }
    //   })
      
    //   res.send("hi");
    // })

   // app.get("/extra",(req,res)=>{
     // var j=0;
      // Teacher.deleteMany({lname:'T0'},(err)=>{
      //   if(err){
      //     console.log(err);
      //   }else{
      //     console.log(hi);
      //   }
      // })
      //for(var i=8000;i<8012;i++){
    //     Teacher.create({
    //       email:"balkar81199@gmail.com",
    //       password:"12345",
    //       fname:"Mr",

    //       lname:("T"+j),
    //       dob:"05/03/1992",
    //       designation:"Primary Classes",
    //       teacherID:i,
    //       classes:['1A','1B','2B','2B','3A','3B']
    //     },(err,doc)=>{
    //       if(!err){
    //         console.log(doc);
    //       }else{
    //         console.log(err);
    //       }
    //     })
    //     j++;
    //   }
    //   res.send("hi")
    // })
  //   Teacher.deleteOne({},(err)=>{
  //     if(!err){
  //       res.send("hii");
  //     }
  //   })
  // }})

  //   Teacher.create({
  //     email:"balkar81199@gmail.com",
  //     password:"12345",
  //     fname:"Mr",
  //     lname:("T"+j),
  //     dob:"05/03/1992",
  //     city:"",
  //     state:"",
  //     school:"",
  //     designation:"Primary Classes",
  //     teacherID:i,
  //     classes:['1A','1B','2B','2B','3A','3B']
  //   },(err,doc)=>{
  //     if(!err){
  //       console.log(doc);
  //     }
  //   })
  // }})