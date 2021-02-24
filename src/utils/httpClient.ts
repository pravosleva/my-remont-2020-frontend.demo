import { Wget as fetch, FetcherController } from '~/utils/fetcher';
import { getApiUrl } from '~/utils/getApiUrl'
import { HttpError } from '~/utils/errors/http/HttpError'
import { httpErrorHandler } from '~/utils/errors/http/axios'
import { IJob } from '~/common/context/MainContext'

class HttpClientSingletone {
  static _instance = new HttpClientSingletone();
  apiUrl: string;
  getMeController: any;
  getRemontController: any;
  putRemontController: any;
  uploadFilesController: any;

  constructor() {
    if (HttpClientSingletone._instance) {
      throw new Error(
        'Instantiation failed: use HttpClientSingletone.getInstance() instead of new.'
      );
    }
    this.apiUrl = getApiUrl()
    this.getMeController = null;
    this.getRemontController = null;
    this.putRemontController = null;
    this.uploadFilesController = null;
  }

  static getInstance(): HttpClientSingletone {
    return HttpClientSingletone._instance;
  }
  universalAxiosResponseHandler(validator: (data: any) => boolean) {
    return (axiosRes) => {
      // console.log(axiosRes)
      if (!validator(axiosRes)) {
        throw new Error('Data is incorrect');
      }
      try {
        return { isOk: true, data: axiosRes.data };
      } catch (err) {
        throw new Error(err.message);
      }
    };
  }
  responseDataHandlerAfterHttpErrorHandler(dataValidator: (data: any) => boolean) {
    return (data: any) => {
      // console.log(axiosRes)
      if (!dataValidator(data)) {
        throw new Error('Data is incorrect');
      }
      try {
        return { isOk: true, data };
      } catch (err) {
        throw new Error(err.message);
      }
    };
  }
  getErrorMsg(data: any): string {
    // console.log(data) // { isAborted: false }
    if (typeof data === 'string') return data
    return !!data?.message
      ? data?.message
      : data?.isAborted
      ? 'DONT_SHOW_ABORT_MSG_AS_KEY'
      : // NOTE about DONT_SHOW_ABORT_MSG_AS_KEY:
        // Этот хак для того, чтоб не показывать лишний раз сообщение об отмененном нетипичном запросе
        // (например, при изменении поля email - нецелевое действие клиента,
        // соотв. сообщение об ошибке не показываем)
        'Извините, что-то пошло не так';
  }

  async getMe(jwt: string): Promise<any> {
    if (!!this.getMeController) {
      this.getMeController.abort();
    }
    this.getMeController = new FetcherController();

    let headers: any = {}
    if (!!jwt) {
      headers = {
        ...headers,
        Authorization: `Bearer ${jwt}`,
      }
    }

    const response = await fetch({
      method: 'GET',
      url: `${this.apiUrl}/users/me`,
      headers,
      // data,
      controller: this.getMeController,
    })
      .then(
        this.universalAxiosResponseHandler((res: any) => !!res?.data?.id)
      )
      .catch((err) => ({ isOk: false, data: err }));

    if (response.isOk) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(this.getErrorMsg(response.data));
  }

  async getRemont(id: string, jwt?: string): Promise<any> {
    if (!id) throw new Error('getRemont: NO id');
    if (!!this.getRemontController) {
      this.getRemontController.abort();
    }
    this.getRemontController = new FetcherController();

    let headers: any = {}
    // if (!!jwt) {
    //   headers = {
    //     ...headers,
    //     Authorization: `Bearer ${jwt}`,
    //   }
    // }

    const response = await fetch({
      method: 'GET',
      mode: 'cors',
      url: `${this.apiUrl}/remonts/${id}`,
      headers,
      controller: this.getRemontController,
    })
      .then(
        this.universalAxiosResponseHandler((res: any) => !!res?.data?.id)
      )
      .catch((err) => ({ isOk: false, data: err }));

    if (response.isOk) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(this.getErrorMsg(response.data));
  }

  async updateRemontJoblist(id: string, joblist: Partial<IJob>[], jwt?: string): Promise<any> {
    if (!id) throw new Error('ERR: !id');
    if (!!this.putRemontController) {
      this.putRemontController.abort();
    }
    this.putRemontController = new FetcherController();

    let headers: any = {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
    if (!!jwt) {
      headers = {
        ...headers,
        Authorization: `Bearer ${jwt}`,
      }
    }

    const response = await fetch({
      method: 'PUT',
      url: `${this.apiUrl}/remonts/${id}`,
      data: { joblist },
      mode: 'cors',
      headers,
      controller: this.putRemontController,
      // NOTE: From docs
      // `validateStatus` defines whether to resolve or reject the promise for a given
      // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
      // or `undefined`), the promise will be resolved; otherwise, the promise will be
      // rejected.
      validateStatus: function (status: number) {
        // return status >= 200 && status < 300; // default
        return status >= 200 && status < 500; // default
      },
    })
      .then(httpErrorHandler)
      .then(
        this.responseDataHandlerAfterHttpErrorHandler((data: any) => !!data?.id)
      )
      .catch((err) => ({ isOk: false, data: err }));

    if (response.isOk) {
      return Promise.resolve(response.data);
    }
    if (response.data instanceof HttpError) {
      return Promise.reject(response.data.resStatus);
    }
    return Promise.reject(this.getErrorMsg(response.data));
  }

  async updateMedia(remontId: string, joblist: any, jwt?: string): Promise<any> {
    if (!remontId || !joblist) throw new Error('ERR: !remontId || !joblist');
    if (!!this.putRemontController) {
      this.putRemontController.abort();
    }
    this.putRemontController = new FetcherController();

    let headers: any = {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
    if (!!jwt) {
      headers = {
        ...headers,
        Authorization: `Bearer ${jwt}`,
      }
    }

    const response = await fetch({
      method: 'PUT',
      url: `${this.apiUrl}/remonts/${remontId}`,
      data: { joblist },
      mode: 'cors',
      headers,
      controller: this.putRemontController,
      // NOTE: From docs
      // `validateStatus` defines whether to resolve or reject the promise for a given
      // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
      // or `undefined`), the promise will be resolved; otherwise, the promise will be
      // rejected.
      validateStatus: function (status: number) {
        // return status >= 200 && status < 300; // default
        return status >= 200 && status < 500; // default
      },
    })
      .then(httpErrorHandler)
      .then(
        this.responseDataHandlerAfterHttpErrorHandler((data: any) => !!data?.id)
      )
      .catch((err) => ({ isOk: false, data: err }));

    if (response.isOk) {
      return Promise.resolve(response.data);
    }
    if (response.data instanceof HttpError) {
      return Promise.reject(response.data.resStatus);
    }
    return Promise.reject(this.getErrorMsg(response.data));
  }

  async uploadFiles(files: any, jwt?: string): Promise<any> {
    if (files.length === 0) throw new Error('ERR: !files.length');
    if (!!this.uploadFilesController) {
      this.uploadFilesController.abort();
    }
    this.uploadFilesController = new FetcherController();

    let headers: any = {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
    if (!!jwt) headers = { ...headers, Authorization: `Bearer ${jwt}` }

    const body = new FormData();

    files.forEach((file: any) => body.append('files', file.file));

    const response = await fetch({
      method: 'POST',
      url: `${this.apiUrl}/upload/`,
      data: body,
      mode: 'cors',
      headers,
      controller: this.uploadFilesController,
      // NOTE: From docs
      // `validateStatus` defines whether to resolve or reject the promise for a given
      // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
      // or `undefined`), the promise will be resolved; otherwise, the promise will be
      // rejected.
      // validateStatus: function (status: number) {
      //   // return status >= 200 && status < 300; // default
      //   return status >= 200 && status < 500; // default
      // },
    })
      .then(httpErrorHandler)
      .then(
        this.responseDataHandlerAfterHttpErrorHandler((data: any) => !!data)
      )
      .catch((err) => ({ isOk: false, data: err }));

    if (response.isOk) {
      return Promise.resolve(response.data);
    }
    if (response.data instanceof HttpError) {
      return Promise.reject(response.data.resStatus);
    }
    return Promise.reject(this.getErrorMsg(response.data));
  }
}

export const httpClient = HttpClientSingletone.getInstance();
