var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments


var commentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    user: {type: String, required: true}
});

var postSchema = new mongoose.Schema({
    text: {type: String, required: true},
    comments:[commentSchema]
});

var Post = mongoose.model('post', postSchema);

var post1 = new Post({
    text:"post 1",
    comments:[]
});

// post1.comments.push({text: "great post!", user: "username"});
// post1.save(function(err, result){
//     if (err) {console.error(err)}
//     else{console.log(result)};
// });

// var post2 = new Post({
//     text: "post 2",
//     comments:[]
// })
// post2.save(function(err, result){
//     if (err) {console.error(err)}
//     else{console.log(result)};
// });

module.exports = Post
