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

const nonExistingId = async () => {
    const blog = new Note({
        'title': 'A new blog',
        'author': 'Rui Le',
        'url': 'deleted.com',
        'likes': 100
    })
    await blog.save()
    await blog.remove()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb
  }

