// FlowEM Standard API Response Formatter

export const apiResponse = {
  success: (res, data, statusCode = 200, message = 'Success') => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  created: (res, data, message = 'Resource created successfully') => {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  },

  paginated: (res, items, total, page = 1, limit = 50) => {
    return res.status(200).json({
      success: true,
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  }
};

