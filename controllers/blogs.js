const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blog = require('../models/blog')

// Refactored to be a middleware
// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//       return authorization.substring(7)
//     }
//     return null
//   }


blogsRouter.get('/', async (request, response) => {
    // promise syntax
    // Blog
    //   .find({})
    //   .then(blogs => {
    //     response.json(blogs)
    //   })

    // async - await syntax
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1
    })
    response.json(blogs)
})


blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})


blogsRouter.post('/', async (request, response) => {

  const user = request.user
  
  const body = request.body
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  
  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })
  
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {

  const userid = request.user.id
  console.log('userid associated with token', userid)

  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === userid.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
    return
  }

  response.status(400).json({ error: 'wrong id' })
})


blogsRouter.put('/:id', async (request, response) => {
    
    // const body = request.body
    // const blog = {
    //     title: body.title,
    //     author: body.author,
    //     url: body.url,
    //     likes: body.likes
    // }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true})
    response.json(updatedBlog)
})

module.exports = blogsRouter