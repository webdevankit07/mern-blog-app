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

    console.log(req.body);
    const newPost = new Post({ ...req.body, userId: req.user.id, slug });

    const createdPost = await newPost.save();

    res.status(201).json(new ApiResponse(201, { post: createdPost }, 'post has been created successfully'));
});

export const getAllPosts = asyncHandler(async (req, res) => {
    const { userId, search, title, slug, category, postId, sort, select, page, limit } = req.query;
    let queryObject = {};
    let apiData;

    //! ......... Data Filteration ............ //
    userId && (queryObject.userId = { $regex: userId, $options: 'i' });
    category && (queryObject.category = { $regex: category, $options: 'i' });
    slug && (queryObject.slug = { $regex: slug, $options: 'i' });
    postId && (queryObject._id = { $regex: postId, $options: 'i' });
    search && {
        $or: [
            (queryObject.title = { $regex: search, $options: 'i' }),
            (queryObject.content = { $regex: search, $options: 'i' }),
        ],
    };
    title && (queryObject.title = { $regex: title, $options: 'i' });
    apiData = Post.find(queryObject);

    //! ......... Sorting ............ //
    if (sort) {
        let sortFix = sort.split(',').join(' ');
        apiData = apiData.sort(sortFix);
    }

    //! ....... Finding Select items ....... //
    if (select) {
        let selectFix = select.split(',').join(' ');
        apiData = apiData.select(selectFix);
    }

    //! ....... Pagination ....... //
    let Page = +page || 1;
    let Limit = +limit || 9;
    let skip = (Page - 1) * Limit;
    const leftRange = skip + 1;
    const rightRange = Limit * Page || Limit;
    apiData = apiData.skip(skip).limit(Limit);

    //! ....... Sending Response ....... //
    const posts = await apiData;
    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
        pageNo: Page,
        itemRange: `${leftRange}-${rightRange}`,
        nbHits: posts.length,
    });
});

export const deletePost = asyncHandler(async (req, res, next) => {});
