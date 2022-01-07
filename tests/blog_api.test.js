const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Test Blog 1',
        date: new Date(),
        url: 'Test URL 1',
        likes: 100,
    },
    {
        title: 'Test Blog 2',
        date: new Date(),
        url: 'Test URL 2',
        likes: 200,
    },
]

// Initialise database state with mock data
beforeEach(async () => {
    await Blog.deleteMany({})
    await new Blog(initialBlogs[0]).save()
    await new Blog(initialBlogs[1]).save()
})


test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 5000)


test('there are two notes', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  
test('the first blog has a 100 likes', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body[0].likes).toBe(100)
  })


test('a specific blog title is within returned blogs', async () => {
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'Test Blog 2'
    )
})

afterAll(() => {
  mongoose.connection.close()
})
