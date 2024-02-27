import Post from '../models/post.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import customError from '../utils/customErrorHandler.js';

export const createPost = asyncHandler(async (req, res, next) => {
    const { title, content, category } = req.body;

    if (!req.user.isAdmin) {
        return next(new customError(403, 'You are not allowed to create a post'));
    }

    const post = await Post.findOne({ title });
    if (post) {
        return next(new customError(403, 'Create unique post or title'));
    }

    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new Post({ ...req.body, userId: req.user.id, slug });
    const createdPost = await newPost.save();

    res.status(201).json(new ApiResponse(201, { post: createdPost }, 'post has been created successfully'));
});

export const getPosts = asyncHandler(async (req, res) => {
    const { userId, searchTerm, title, slug, category, postId, sort, select, page, limit } = req.query;
    let queryObject = {};
    let postData;

    //! ......... Data Filteration ............ //
    userId && (queryObject.userId = { $regex: userId, $options: 'i' });
    category && (queryObject.category = { $regex: category, $options: 'i' });
    category === 'all' && delete queryObject.category;
    slug && (queryObject.slug = { $regex: slug, $options: 'i' });
    postId && (queryObject._id = postId);
    searchTerm && {
        $or: [
            (queryObject.title = { $regex: searchTerm, $options: 'i' }),
            (queryObject.content = { $regex: searchTerm, $options: 'i' }),
        ],
    };
    title && (queryObject.title = { $regex: title, $options: 'i' });
    postData = Post.find(queryObject);

    //! ......... Sorting ............ //
    if (sort) {
        let sortFix = sort.split(',').join(' ');
        const sortValue = sortFix === 'desc' ? { createdAt: 1 } : sortFix === 'asc' ? { createdAt: -1 } : sortFix;
        postData = postData.sort(sortValue);
    }

    //! ....... Finding Select items ....... //
    if (select) {
        let selectFix = select.split(',').join(' ');
        postData = postData.select(selectFix);
    }

    //! ....... Pagination ....... //
    let Page = +page || 1;
    let Limit = +limit || 9;
    let skip = (Page - 1) * Limit;
    const leftRange = skip + 1;
    const rightRange = Limit * Page || Limit;
    postData = postData.skip(skip).limit(Limit);

    //! ....... Sending Response ....... //
    const posts = await postData;
    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                posts,
                totalPosts,
                lastMonthPosts,
                pageNo: Page,
                itemRange: `${leftRange}-${rightRange}`,
                nbHits: posts.length,
            },
            'success'
        )
    );
});

export const getAllPosts = asyncHandler(async (req, res) => {
    const { userId, searchTerm, title, slug, category, postId, sort, select, page, limit } = req.query;
    let queryObject = {};
    let postData;

    //! ......... Data Filteration ............ //
    userId && (queryObject.userId = { $regex: userId, $options: 'i' });
    category && (queryObject.category = { $regex: category, $options: 'i' });
    category === 'all' && delete queryObject.category;
    slug && (queryObject.slug = { $regex: slug, $options: 'i' });
    postId && (queryObject._id = postId);
    searchTerm && {
        $or: [
            (queryObject.title = { $regex: searchTerm, $options: 'i' }),
            (queryObject.content = { $regex: searchTerm, $options: 'i' }),
        ],
    };
    title && (queryObject.title = { $regex: title, $options: 'i' });
    postData = Post.find(queryObject);

    //! ......... Sorting ............ //
    if (sort) {
        let sortFix = sort.split(',').join(' ');
        const sortValue = sortFix === 'desc' ? { createdAt: 1 } : sortFix === 'asc' ? { createdAt: -1 } : sortFix;
        postData = postData.sort(sortValue);
    }

    //! ....... Finding Select items ....... //
    if (select) {
        let selectFix = select.split(',').join(' ');
        postData = postData.select(selectFix);
    }

    //! ....... Pagination ....... //
    let Page = +page || 1;
    let skip = Page - 1;
    postData = postData.skip(skip);

    //! ....... Sending Response ....... //
    const posts = await postData;
    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                posts,
                totalPosts,
                lastMonthPosts,
                pageNo: Page,
                nbHits: posts.length,
            },
            'success'
        )
    );
});

export const deletePost = asyncHandler(async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(new customError(403, 'You are not allowed to delete this post'));
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json(new ApiResponse(200, {}, 'The post has been deleted'));
});

export const updatePost = asyncHandler(async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(new customError(403, 'You are not allowed to update this post'));
    }
    console.log(req.body);
    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

    console.log(slug);

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
            $set: {
                title: req.body.title,
                slug,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
            },
        },
        { new: true }
    );

    console.log(updatePost);

    res.status(201).json(new ApiResponse(201, updatedPost, 'post has been updated successfully'));
});
