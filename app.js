//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose')


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/blogDB')

const postSchema = mongoose.Schema({
    title: String,
    content: String,
})

const PostModel = mongoose.model('Post', postSchema);

app.get("/", function (req, res) {
    PostModel.find().then(posts => {
        res.render("home", {allEntries: posts});
    })
});

app.get("/about", function (req, res) {
    res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function (req, res) {
    res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {
    const post  = new PostModel({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    post.save()
    res.redirect("back");

});

app.get("/posts/:postID", function (req, res) {
    const reqPostID = req.params.postID;
    console.log(reqPostID)

    PostModel.findOne({_id:reqPostID}).then((post)=>{
        if (post._id.toString() === reqPostID) {
            res.render("post", {
                title: post.title,
                content: post.content
            });
        };
    });

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
