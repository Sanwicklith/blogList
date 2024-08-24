const { test, describe, after } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');

const api = supertest(app);

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

test('blog is returned in json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs');

  // Ensure the first blog has an id property and not _id
  const blog = response.body[0];

  // Assert using strict equality
  assert.strictEqual(typeof blog.id, 'string');
  assert(blog._id === undefined);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Blog Title',
    author: 'Author',
    url: 'https://www.example.com',
    likes: 10,
  };

  const blogsAtStart = await api.get('/api/blogs');
  const lengthOfBlog = blogsAtStart ? blogsAtStart.body.length : 0;

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const res = await api.get('/api/blogs');
  const blogsAtEnd = res.body;

  const titles = blogsAtEnd.map(b => b.title);

  assert.strictEqual(blogsAtEnd.length, lengthOfBlog + 1);
  assert(titles.includes('Blog Title'));
});

test('when not given likes returns 0', async () => {
  const newBlog = {
    title: 'Blog Title',
    author: 'Author',
    url: 'https://www.example.com',
  };
  const response = await api.post('/api/blogs').send(newBlog).expect(201);
  const blog = response.body;
  assert.strictEqual(blog.likes, 0);
});

test('blog without title or url is not added', async () => {
  const newBlog = {
    url: 'https://www.example.com',
  };
  const response = await api.post('/api/blogs').send(newBlog).expect(400);
  const blog = response.body;
  assert.strictEqual(blog.title, undefined);
});

test('delete blog if given id is in blogList', async () => {
  // Get the list of blogs and take the first one
  const res = await api.get('/api/blogs');
  const blogToDelete = res.body[0];
  const id = blogToDelete.id;

  // Delete the blog by its id
  const deleteResponse = await api.delete(`/api/blogs/${id}`);
  console.log('Delete response status:', deleteResponse.status); // Debugging line
  assert.strictEqual(deleteResponse.status, 204); // Using assert instead of expect

  // Get the updated list of blogs after deletion
  const res2 = await api.get('/api/blogs');
  console.log('Updated blogs:', res2.body); // Debugging line
  const ids = res2.body.map(b => b.id);

  // Ensure the blog count decreased by 1
  assert.strictEqual(res2.body.length, res.body.length - 1);

  // Check that the deleted blog's id is not in the new list
  assert.ok(!ids.includes(id)); // Convert expect to assert
});

test('if field is given return blog with new field value', async () => {
  const res = await api.get('/api/blogs');
  const blogToUpdate = res.body[0];
  const id = blogToUpdate.id;

  const newBlog = {
    title: 'New Blog Title',
    author: 'New Author',
    url: 'https://www.example.com',
    likes: 34,
  };
  const response = await api.put(`/api/blogs/${id}`).send(newBlog).expect(200);
  const blog = response.body;
  assert.strictEqual(blog.title, newBlog.title);
  assert.strictEqual(blog.author, newBlog.author);
  assert.strictEqual(blog.url, newBlog.url);
  assert.strictEqual(blog.likes, newBlog.likes);
});

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ];

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

  test('favorite blog', () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, blogs[2]);
  });
});

after(async () => {
  await mongoose.connection.close();
});
