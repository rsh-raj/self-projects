const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogDb")
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
const blogSchema = mongoose.Schema({
    title: String,
    text: String
});
const Post = mongoose.model("Post", blogSchema);
app.get("/" + "view", function (req, res) {
   
    Post.find(function (err, posts) {
        if (err) console.log("Some error occurred while fetching posts\n " + err);

        else res.render("view", { content: posts[req.query.id] });
    });

});
app.get("/", function (req, res) {
    Post.find(function (err, posts) {
        if (err) console.log("Some error occurred while fetching posts\n " + err);
        
        else {
            
            res.render("index", {
                blogContent: posts,
                trimmedContent: posts,
            });
        }
    });


});
app.get("/compose", function (req, res) {
    res.render("compose");
});

app.get("/about", function (req, res) {
    res.render("about");
});
app.get("/contact", function (req, res) {
    res.render("contact");
});
app.post("/", function (req, res) {

    const post = new Post({
        title: req.body.title,
        text: req.body.text
    });
    console.log(post.title);
    if (post.title != '' || post.text!= '') post.save();


    res.redirect("/");
});

app.listen(3000, function () {
    console.log("app is listening at 3000");
});
