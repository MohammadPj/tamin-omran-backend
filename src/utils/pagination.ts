// model, page, limit, query, sort

interface Props {
  model: any;
  page: number;
  limit: number;
  query: any;
  sort: any;
}

export const paginateResults = async ({
  model,
  sort,
  query,
  page = 1,
  limit = 10,
}: Props) => {

  console.log('page', page)
  console.log('limit', limit)

  const currentPage = page || 1

  try {
    const results = await model
      .find(query)
      .sort(sort)
      .skip((currentPage - 1) * +limit)
      .limit(+limit);

    const count = await model.countDocuments(query);

    const response = {
      data: results,
      meta: {
        count: count,
        page: +currentPage,
        limit: +limit,
        totalPages: Math.ceil(count / +limit),
      },
    };

    return response;
  } catch (error) {
    // Handle errors
    console.error(error);
    throw error;
  }
};
