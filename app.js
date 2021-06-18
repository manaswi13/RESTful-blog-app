var express           = require("express"),
    app               = express(),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    expressSanitizer  = require("express-sanitizer"),
    methodOverride    = require("method-override");

//App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine","ejs");

//Mongoose Config
mongoose.connect("mongodb://localhost/RESTful_blog_app");
var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var blog = mongoose.model("blog",blogSchema);

// blog.create({
//   title: "Awesome Day",
//   image: "https://pixabay.com/get/57e7d4474252ab14f1dc84609620367d1c3ed9e04e5074417d2f7ad6974ec5_340.jpg",
//   body: "Hey! What an awesome day!!"
// });

//ROUTES
app.get("/",function(req,res){
  res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
  blog.find({},function(err,blogs){
    if(err){
      console.log(err);
    }
    else{
      res.render("index",{blogs: blogs});
    }
  })
});
//NEW ROUTE
app.get("/blogs/new",function(req,res){
  res.render("new");
});
//CREATE ROUTE
app.post("/blogs",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.create(req.body.blog, function(err,blog){
    if(err){
      res.redirect("/blogs/new");
    }
    else{
      res.redirect("/blogs");
    }
  })
});
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
  blog.findById(req.params.id, function(err,foundBlog){
    if(err){
      console.log(err);
    }
    else{
      res.render("show",{blog: foundBlog});
    }
  })
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
  blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("edit",{blog: foundBlog});
    }
  })
});
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
    if(err){
      res.redirect("/blogs/req.params.id/edit");
    }
    else{
      res.redirect("/blogs");
    }
  })
});
//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
  blog.findByIdAndDelete(req.params.id,function(err,deleteBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs");
    }
  })
})

app.listen(3000, function(){
  console.log("Server has been started!");
});