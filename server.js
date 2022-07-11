// Module exports
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
// Mongoose setup
mongoose.connect("mongodb+srv://admin-anon:Test123@blogdbcluster.vb2nn.mongodb.net/blogDb")
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
const blogSchema = mongoose.Schema({
    title: String,
    text: String
});
const Post = mongoose.model("Post", blogSchema);

//get requests
app.get("/", function (req, res) {
    Post.find(function (err, posts) {
        if (err) console.log("Some error occurred while fetching posts\n " + err);

        else {

            res.render("index", {

                trimmedContent: posts,
            });
        }
    });
});
app.get("/" + "view", function (req, res) {

    Post.find(function (err, posts) {
        if (err) console.log("Some error occurred while fetching posts\n " + err);

        else res.render("view", { content: posts[req.query.id] });
    });
});

app.get("/compose", function (req, res) {
    let post = {}, id = req.query.id;
    console.log(id);
    if (id) {
        Post.find({ _id: id }, function (err, post) {
            if (err) console.log("Post not found " + err);
            // console.log(post);
            res.render("compose", { post: post[0], header: "Edit", id: id });


        })
    }
    else res.render("compose", { post: { title: '', text: '' }, header: "Write something here", id: '' });

});
app.get("/log-out", function (req, res) {
    res.render("log-out");
});
app.get("/profile", function (req, res) {
    res.render("profile");
});
app.get("/delete", function (req, res) {
    console.log(req.query.id);
    res.redirect("/");
    Post.deleteOne({ _id: req.query.id }, function (err) {
        if (err) console.log("Some error occurred while deleting: " + err);
        else console.log("Successfully deleted!");
    });
});

//Post request -> If id is present then update the post otherwise add the post to db

app.post("/", function (req, res) {
    if (req.body.id) {
        // console.log(req.body.id);
        Post.updateOne({ _id: req.body.id }, { title: req.body.title, text: req.body.text }, function (err) {
            if (err) console.log("Some error occurred while deleting: " + err);
            else console.log("Successfully updated!");

        });
    }
    else {
        const post = new Post({
            title: req.body.title,
            text: req.body.text
        });
        // console.log(post.title);
        if (post.title != '' || post.text != '') post.save();
    }


    res.redirect("/");
});
let port=process.env.PORT;

app.listen(port || 3000, function () {
    console.log("app is listening at 3000");
});
