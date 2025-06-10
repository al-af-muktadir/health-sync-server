export const pagination = (options: any) => {
  const page = options.page || 1;
  const limit = options.page || 10;
  const skip = Number(page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    skip,
    limit,
    sortBy,
    sortOrder,
    page,
  };
};
