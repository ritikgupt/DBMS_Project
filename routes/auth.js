var express=require("express");
var router=express.Router();
var passport=require("passport");
var Shop=require("../models/shop");
var Book=require("../models/book");
var Other=require("../models/other");
var Sport=require("../models/sport");
var Mattress=require("../models/mattress");
var Cycle=require("../models/cycle");
var User=require("../models/user");
var Profile=require("../models/profile");
router.get("/shops/new",isLoggedIn,function(req,res){
    res.render("new",{currentUser:req.user});
})
router.get("/shops/sign",function(req,res){
    res.render("sign");
})
router.post("/shops/sign",function(req,res){
    req.body.username
    req.body.password
    req.body.reg_num
    req.body.room
    req.body.mobile
    req.body.email
    User.register(new User({username:req.body.username,email:req.body.email,room:req.body.room,mobile:req.body.mobile,reg_num:req.body.reg_num}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.redirect("/");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/");
            })
        }
    })
})
router.get("/shops/login",function(req,res){
    res.render("login");
})
router.post("/shops/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/shops/login"
}), function (req, res) {
})
router.get("/shops/logout",function(req,res){
    req.logout();
    res.redirect("/");
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else
    res.redirect("/shops/login");
}
router.get("/:id",isLoggedIn,function(req,res){
    Shop.findById(req.params.id,function(err,foundShop){
        if(err){
            res.redirect("/");
        }
        else{
            res.render("show",{shop:foundShop,currentUser:req.user});
        }
    })

})
router.get("/:id/edit",isLoggedIn,function(req,res){
    Shop.findById(req.params.id,function(err,foundShop){
        if(err){
            console.log("Error");
        }
        else{
            res.render("edit",{shop:foundShop,currentUser:req.user})
        }
    })
})    
router.put("/:id",function(req,res){
    req.body.shop.body=req.sanitize(req.body.shop.body)
    Shop.findByIdAndUpdate(req.params.id,req.body.shop,function(err,updatedShop){
        if(err){
            res.redirect("home");
        }
        else{
            res.redirect("/"+req.params.id);
        }
    })
})
router.delete("/:id",isLoggedIn,function(req,res){
    Shop.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/")
        }
        else{
            res.redirect("/")
        }
    })
})
router.get("/shops/profile/:id",isLoggedIn,function(req,res){
    Profile.find({},function(err,profiles){
        if(err)
        console.log("Error!");
        else
        res.render("profile",{currentUser:req.user});
        // res.redirect("/shops/editprofile/"+ req.user.id)
    })
})

router.get("/shops/redirect",(req,res,next)=>{
    return res.redirect("/shops/editprofile/"+ req.user.id);
})
router.get("/shops/editprofile/:id",function(req,res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            console.log("error!");
        }
        else{
            console.log("Found!!!");
            // console.log(foundUser);
            res.render("editprofile",{user:foundUser,currentUser:req.user})
        }
    })
})    

// router.put("/shops/profile",function(req,res){
//     User.findByIdAndUpdate(req.params.id,req.body.currentUser,function(err,updatedcurrentUser){
//         if(err){
//             res.redirect("home");
//         }
//         else{
//             res.redirect("/shops/profile",{currentUser:updatedcurrentUser});
//         }
//     })
// })

router.post("/shops/profile/:id",async (req,res,next)=>{
    try{
        let usr = await User.findOneAndUpdate({_id : req.body.id},{username : req.body.username , reg_num : req.body.reg_num,email : req.body.email,room : req.body.room,mobile : req.body.mobile})
        console.log(req.body.id);
        let usr2 = await User.findOne({_id : req.body.id});
        res.render("profile",{currentUser : usr2});
    }catch(error){
        next(error)
    }
})
router.get("/shops/contact",isLoggedIn,function(req,res){
    Cycle.find({},function(err,cycles){
        if(err)
        res.redirect("/shops/login");
        else
        res.render("contact",{currentUser:req.user,shops:shops});
    })
})
router.get("/shops/profile/:id/newpassword",isLoggedIn,function(req,res){
        res.render("newpassword",{currentUser:req.user});
        // res.redirect("/shops/editprofile/"+ req.user.id)
});

module.exports=router;