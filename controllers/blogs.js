const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
    // promise syntax
    // Blog
    //   .find({})
    //   .then(blogs => {
    //     response.json(blogs)
    //   })

    // async - await syntax
    const blogs = await Blog.find({})
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
    const blog = new Blog(request.body)
  
    // blog
    //   .save()
    //   .then(result => {
    //     response.status(201).json(result)
    //   })

    const result = await blog.save()
    response.status(201).json(result)
})


blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
    
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
    response.json(updatedBlog)
})

module.exports = blogsRouter