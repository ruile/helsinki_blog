const dummy = blogs => {
    return 1
}


const totalLikes = blogs => {
   const reducer = (sum, blog) => {
       return sum + blog.likes
   } 

   return blogs.length == 0 ? 0 : blogs.reduce(reducer, 0)
}


const favouriteBlog = blogs => {
    const reducer = (prevailingBlog, blog) => {
        return prevailingBlog.likes > blog.likes? prevailingBlog : blog
    }

    return blogs.length == 0? null : blogs.reduce(reducer, blogs[0])
}


const mostBlogs = blogs => {
    const author_to_blogs = new Map()

    blogs.forEach(blog => {
        author_to_blogs.has(blog.author) ? author_to_blogs.set(blog.author, author_to_blogs.get(blog.author) + 1) : author_to_blogs.set(blog.author, 1)
    })

    const author_blogs = Array.from(author_to_blogs).map(([author, blogs]) => ([author, blogs]))

    const reducer = (prevailingEntry, entry) => {
        return prevailingEntry[1] > entry[1] ? prevailingEntry : entry
    }

    const [author, num_blogs] = author_blogs.reduce(reducer, author_blogs[0])
    
    return {
        author: author,
        blogs: num_blogs
    }

}


const mostLikes = blogs => {
    const author_to_likes = new Map()

    blogs.forEach(blog => {
        author_to_likes.has(blog.author) ? author_to_likes.set(blog.author, author_to_likes.get(blog.author) + blog.likes) : author_to_likes.set(blog.author, blog.likes)
    })

    const author_likes = Array.from(author_to_likes).map(([author, blogs]) => ([author, blogs]))

    const reducer = (prevailingEntry, entry) => {
        return prevailingEntry[1] > entry[1] ? prevailingEntry : entry
    }

    const [author, num_likes] = author_likes.reduce(reducer, author_likes[0])
    
    return {
        author: author,
        blogs: num_likes
    }

}



module.exports = {
    dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}