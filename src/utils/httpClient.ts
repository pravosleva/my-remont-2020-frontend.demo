import { Wget as fetch, FetcherController } from '~/utils/fetcher';
import { getApiUrl } from '~/utils/getApiUrl'

class HttpClientSingletone {
  static _instance = new HttpClientSingletone();
  apiUrl: string;
  getMeController: any;

  constructor() {
    if (HttpClientSingletone._instance) {
      throw new Error(
        'Instantiation failed: use HttpClientSingletone.getInstance() instead of new.'
      );
    }
    this.apiUrl = getApiUrl()
    this.getMeController = null;
  }

  static getInstance() {
    return HttpClientSingletone._instance;
  }
  universalResponseHandler(validator) {
    return (axiosRes) => {
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
  getErrorMsg(data) {
    // console.log(data) // { isAborted: false }
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

  async getMe(jwt: string) {
    if (!!this.getMeController) {
      this.getMeController.abort();
    }
    this.getMeController = new FetcherController();

    const response = await fetch({
      method: 'GET',
      url: `${this.apiUrl}/users/me`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      // data,
      controller: this.getMeController,
    })
      .then(
        this.universalResponseHandler((res: any) => !!res?.data?.id)
      )
      .catch((err) => ({ isOk: false, data: err }));

    if (response.isOk) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(this.getErrorMsg(response.data));
  }
}

export const httpClient = HttpClientSingletone.getInstance();
