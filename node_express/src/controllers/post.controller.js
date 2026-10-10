import {Post} from '../models/post.model.js';

const createPost = async (req, res) => {
    try {
        const { name, description, age} = req.body;

        // basic validation
        if (!name || !description || !age) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        };

        // check if post already exists by name
        const existingPost = await Post.findOne({ name: name.trim() });
        if (existingPost) {
            return res.status(400).json({ message: 'Post with this name already exists' });
        }

        // create new post
        const post = await Post.create({name, description, age});

        return res.status(201).json({ 
            message: 'Post created successfully',
            post: {
                id: post._id,
                name: post.name,
                description: post.description,
                age: post.age,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                version: post.__v
            } 
        });
    } catch (error) {
        console.error("POST CREATION ERROR:", error);
        return res.status(500).json({ message: 'Error creating post', error: error.message });
    };
};

const getAllPosts = async (req, res) => {
    try {
        const getAllPosts = await Post.find();
        return res.status(200).json(getAllPosts);
    } catch (error) {
        console.error("GET ALL POSTS ERROR:", error);
        return res.status(500).json({ message: 'Error retrieving posts', error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        //basic validation
        const { name, description, age } = req.body;

        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Please provide data to update' });
        }

        const  post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // check if post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error("UPDATE POST ERROR:", error);
        return res.status(500).json({ message: 'Error updating post', error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("DELETE POST ERROR:", error);
        return res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};

export { createPost, getAllPosts, updatePost, deletePost };