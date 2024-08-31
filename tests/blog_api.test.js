const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

// ... other test setup

test('a valid blog can be added', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password'
  }

  await api
    .post('/api/users')
    .send(newUser)

  const result = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password'
    })

  const token = result.body.token

  const newBlog = {
    title: 'Test blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // ... rest of the test
})

test('adding a blog fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Test blog without token',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  // ... rest of the test
})

// ... other tests