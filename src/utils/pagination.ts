// model, page, limit, query, sort

interface Props {
  model: any;
  page: number;
  limit: number;
  query: any;
  documents: any
}

export const paginateResults = async ({
  model,
  documents,
  query,
  page = 1,
  limit = 10,
}: Props) => {

  const currentPage = page || 1

  try {


    const count = await model.countDocuments(query);

    return {
      data: documents,
      meta: {
        count: count,
        page: +currentPage,
        limit: +limit,
        totalPages: Math.ceil(count / +limit),
      },
    };
  } catch (error) {
    // Handle errors
    console.error(error);
    throw error;
  }
};
