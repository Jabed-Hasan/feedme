import { baseApi } from "@/redux/api/baseApi";

interface BlogResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: any[];
}

interface BlogIdParams {
  id: string;
}

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => ({
        url: "/blogs/all-blogs",
        method: "GET",
      }),
      transformResponse: (response: BlogResponse) => {
        // Ensure response has the expected format
        if (!response || !response.data) {
          // Return a properly formatted response even if the API failed
          return {
            status: false,
            statusCode: 404,
            message: "No data received from server",
            data: [],
          };
        }
        return response;
      },
      // Handle errors at the query level
      transformErrorResponse: (error: any) => {
        console.error("Error fetching blogs:", error);
        return error;
      },
      providesTags: ["Blogs"],
    }),

    getBlogById: builder.query({
      query: (id: string) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
      providesTags: ["Blogs"],
    }),

    createBlog: builder.mutation({
      query: (data) => ({
        url: "/blogs/create-blog",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response) => {
        // Check if response is empty or undefined
        if (
          !response ||
          typeof response !== "object" ||
          Object.keys(response).length === 0
        ) {
          return { message: "Unknown error occurred. Please try again." };
        }

        // Log the error after checking it's valid
        console.error("Error creating blog:", response);

        // Return a structured error that will be easier to handle
        if (response.status === "FETCH_ERROR") {
          return { message: "Network error. Please check your connection." };
        }

        // Try to extract error message from response
        if (response.data) {
          return response.data;
        }

        return { message: "Failed to create blog. Please try again." };
      },
      invalidatesTags: ["Blogs"],
    }),

    updateBlog: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `/blogs/${blogId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/blogs/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi; 