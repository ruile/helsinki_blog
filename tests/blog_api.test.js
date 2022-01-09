const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    // cant use await inside a for each - hence this workaround
    // const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    // const promiseArray = blogObjects.map(blog => blog.save())

    // // promise all creates a group promise that is fulfilled when all promises must be fulfilled 
    // await Promise.all(promiseArray)

    // Alternative - clearer
    for (let blog of helper.initialBlogs) {
        await new Blog(blog).save()
    }
})


describe('when there is initially some blogs saved', () => {
    
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 5000)

    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    
    test('a specific blog title is within returned blogs', async () => {
        const response = await api.get('/api/blogs')
      
        const titles = response.body.map(r => r.title)
        expect(titles).toContain(
          'Test Blog 2'
        )
    })

})


describe('viewing a specific blog', () => {

    test('blog with valid id can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
        console.log('Blogs at start', blogsAtStart)
      
        const blogToView = blogsAtStart[0]
        console.log('Blog to view', blogToView)
    
      
        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
      
        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
      
        expect(resultBlog.body).toEqual(processedBlogToView)
      })


    test('the first blog has a 100 likes', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body[0].likes).toBe(100)
    })


    test('a blog has a property called id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blog = blogsAtStart[0]
  
        expect(blog.id).toBeDefined()
    })
    
})


describe('adding a new blog', () => {

    test('blog with valid data can be added', async () => {
        const newBlog = {
            'title': 'A funny day',
            'author': 'Yi Fat',
            'url': 'yi fat .com',
            'likes': 500
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).toContain(
            'A funny day'
        )
    })
    
    
    test('blog without title fails with 400', async () => {
        const newBlog = {
          'author': 'Rui Le',
          'url': 'ruile.com',
          'likes': 300
        }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })

      
      test('blog with valid id can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
      
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        expect(blogsAtEnd).toHaveLength(
          helper.initialBlogs.length - 1
        )
      
        const titles = blogsAtEnd.map(r => r.title)
      
        expect(titles).not.toContain(blogToDelete.title)
      })


      test('blog with no likes is added with default value of 0', async () => {
            const newBlog = {
                'title': 'Blog with no likes',
                'author': 'Rui Le',
                'url': 'ruile.com',
            }
            
            const result = await api
                            .post('/api/blogs')
                            .send(newBlog)
                            .expect(201)
            
            expect(result.body.likes).toEqual(0)
      })
})


describe('updating a blog', () => {

    test('blog with valid id and fields is updated', async () => {

        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updateBlog = {
            // no need to submit other fields (only fields changed will be updated)
            // 'title': blogToUpdate.title
            // 'author': blogToUpdate.author,
            // 'url': blogToUpdate.url,
            'likes': 333
        }


        const result = await api
                        .put(`/api/blogs/${blogToUpdate.id}`)
                        .send(updateBlog)
                        .expect(200)

        expect(result.body.likes).toEqual(333)
        expect(result.body.title).toEqual(blogToUpdate.title)
        expect(result.body.author).toEqual(blogToUpdate.author)
        expect(result.body.url).toEqual(blogToUpdate.url)
    })
})

afterAll(() => {
    mongoose.connection.close()
})