const host = "http://localhost:8000";

export const signUpRoute = `${host}/api/auth/signup`;
export const loginRoute = `${host}/api/auth/login`;
export const getAllThreadsRoute = `${host}/api/thread/get-threads`;
export const getFilterRoute = (category, owner) => {
  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }
  if (owner) {
    params.append("owner", owner);
  }
  return `${host}/api/thread/filter?${params.toString()}`;
};
export const createNewThread = `${host}/api/thread/create-thread`;
export const postRoute = `${host}/api/post/posts`;

export const getPostsRoute = (threadId) => {
  const params = new URLSearchParams();
  if (threadId) {
    params.append("threadId", threadId);
  }
  return `${host}/api/post/get-posts?${params.toString()}`;
};
export const createPostRoute = `${host}/api/post/create-post`;
export const getAuthorsRoute = `${host}/api/post/allauthors`;
export const createCommentRoute = `${host}/api/post/comment`;
export const logoutRoute = `${host}/api/auth/logout`;
export const replyCommentRoute = `${host}/api/post/reply`;
export const deletePostRoute = `${host}/api/post/delete-post`;
