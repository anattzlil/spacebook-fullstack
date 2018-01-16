var SpacebookApp = function() {
  
  var posts = [];

  var getPosts = function(){
    $.ajax({
      method: "GET",
      url: 'posts',
      dataType: "json",
      success: function (data) {
          console.log(data);
          for (i in data){
            posts[i] = data[i];
          }
          console.log(posts);
          _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
      }
    });
  };

  var $posts = $(".posts");

  _renderPosts();

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.ajax({
      method: "POST",
      url: 'posts',
      dataType: "json",
      data:{text: newPost},
      success: function (data) {
        posts.push({ text: newPost, comments: [] });
        _renderPosts();
        console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    })
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function(id, index) {
    $.ajax({
      method: "DELETE",
      url: 'delete',
      dataType: "json",
      data: {_id: id},
      success: function (data) {
        console.log(posts)
        posts.splice(index, 1);
        _renderPosts();
        console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    })
    

  };

  var addComment = function(newComment, postIndex) {
    posts[postIndex].comments.push(newComment);
    _renderComments(postIndex);
  };


  var deleteComment = function(postIndex, commentIndex) {
    posts[postIndex].comments.splice(commentIndex, 1);
    _renderComments(postIndex);
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    getPosts: getPosts
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function() {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
  var id = $(this).closest('.post').data().id;
  var index = $(this).closest('.post').index();
  app.removePost(id, index);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});

app.getPosts();