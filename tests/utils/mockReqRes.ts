export const createMocks = (options: any) => {
  const req: any = {
    method: options.method,
    body: options.body,
    query: options.query,
    headers: options.headers || {},
  };

  const res: any = {
    _status: 200,
    _data: null,
    statusCode: 200,
    setHeader: jest.fn(),
    status: jest.fn(function (code: number) {
      this._status = code;
      this.statusCode = code;
      return this;
    }),
    json: jest.fn(function (data: any) {
      this._data = data;
      return this;
    }),
    end: jest.fn(function () {
      return this;
    }),
    _getStatusCode: function () {
      return this._status;
    },
    _getData: function () {
      return this._data;
    },
  };

  return { req, res };
};
