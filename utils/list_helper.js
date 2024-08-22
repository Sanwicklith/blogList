const dummy = blog => {
  if (blog) {
    return 1;
  }
};

const totalLikes = blog => {
  const likes = blog.map(blog => blog.likes);
  if (likes.length === 0) {
    return 0;
  } else if (likes.length === 1) {
    return likes[0];
  } else {
    return likes.reduce((a, b) => a + b, 0);
  }
};

const favoriteBlog = (blogs)=>{
  const likes = blogs.map(blog => blog.likes);
  const maxLikes = Math.max(...likes);
  const blog = blogs.find(blog => blog.likes === maxLikes);
  return blog;
}

// const mostBlogs = (blogs)=>{
//   const likes = blogs.map(blog => blog.likes);
//   const maxLikes = Math.max(...likes);
//   const blog = blogs.find(blog => blog.likes === maxLikes);
//   return {author: blog.author, blogs: blog.blogs};
// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  // mostBlogs
};
