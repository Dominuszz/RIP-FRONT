/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
// В api/Api.ts (сгенерированный файл) нужно добавить новую структуру
// или модифицировать существующий метод

export interface SerializerComplexClassListResponse {
  items?: SerializerComplexClassJSON[];
  total?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}


export interface SerializerBigORequestJSON {
  bigo_request_id?: number;
  calculated_complexity?: string;
  calculated_time?: number;
  creator_login?: string;
  date_create?: string;
  date_finish?: string;
  date_update?: string;
  moderator_login?: string;
  status?: string;
}

export interface SerializerCompClassRequestJSON {
  array_size?: number;
  big_o_request_id?: number;
  comp_class_request_id?: number;
  complexclass_id?: number;
}

export interface SerializerComplexClassJSON {
  compclass_id?: number;
  complexity?: string;
  degree?: number;
  degree_text?: string;
  description?: string;
  img?: string;
  is_delete?: boolean;
}

export interface SerializerStatusJSON {
  status?: string;
}

export interface SerializerUserJSON {
  id?: string;
  is_moderator?: boolean;
  login?: string;
  password?: string;
}

export interface AllBigoRequestsListParams {
  /** Начальная дата (YYYY-MM-DD) */
  "from-date"?: string;
  /** Конечная дата (YYYY-MM-DD) */
  "to-date"?: string;
  /** Статус заявки */
  status?: string;
}

export interface BigorequestDetailParams {
  /** ID заявки */
  id: number;
}

export interface DeleteBigorequestDeleteParams {
  /** ID заявки */
  id: number;
}

export interface EditBigorequestUpdateParams {
  /** ID заявки */
  id: number;
}

export interface FinishBigorequestUpdateParams {
  /** ID заявки */
  id: number;
}

export interface FormBigorequestUpdateParams {
  /** ID заявки */
  id: number;
}

export interface CompclassrequestUpdateParams {
  /** ID класса сложности */
  compclassId: number;
  /** ID заявки */
  bigoRequestId: number;
}

export interface CompclassrequestDeleteParams {
  /** ID класса сложности */
  compclassId: number;
  /** ID заявки */
  bigoRequestId: number;
}

export interface ComplexclassListParams {
  "search-degree"?: string;
  page?: number;
  limit?: number;
}

export interface ComplexclassDetailParams {
  /** ID класса сложности */
  id: number;
}

export interface AddPhotoCreatePayload {
  /** Изображение класса сложности */
  image: File;
}

export interface AddPhotoCreateParams {
  /** ID класса сложности */
  id: number;
}

export interface AddToBigorequestCreateParams {
  /** ID класса сложности */
  id: number;
}

export interface DeleteCompclassDeleteParams {
  /** ID класса сложности */
  id: number;
}

export interface EditCompclassUpdateParams {
  /** ID класса сложности */
  id: number;
}

export interface InfoListParams {
  /** Логин пользователя */
  login: string;
}

export interface InfoUpdateParams {
  /** Логин пользователя */
  login: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Big O Request API
 * @version 1.0
 * @license MIT
 * @contact API Support <support@bigorequest.com> (http://localhost:8080)
 *
 * API для управления расчётами времени и сложности Классов сложности
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  bigorequest = {
    /**
     * @description Возвращает заявки с возможностью фильтрации по датам и статусу
     *
     * @tags bigorequests
     * @name AllBigoRequestsList
     * @summary Получить список заявок на расчёт
     * @request GET:/bigorequest/all-bigo_requests
     * @secure
     * @response `200` `(SerializerBigORequestJSON)[]` Список заявок
     * @response `400` `Record<string,string>` Неверный формат даты
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    allBigoRequestsList: (
      query: AllBigoRequestsListParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerBigORequestJSON[], Record<string, string>>({
        path: `/bigorequest/all-bigo_requests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о текущей заявке-черновике на расчёт пользователя
     *
     * @tags bigorequests
     * @name BigorequestCartList
     * @summary Получить корзину расчёта
     * @request GET:/bigorequest/bigorequest-cart
     * @secure
     * @response `200` `Record<string,any>` Данные корзины заявки-черновика
     * @response `400` `Record<string,string>` Неверный запрос
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    bigorequestCartList: (params: RequestParams = {}) =>
      this.http.request<Record<string, any>, Record<string, string>>({
        path: `/bigorequest/bigorequest-cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о заявке
     *
     * @tags bigorequests
     * @name BigorequestDetail
     * @summary Получить заявку по ID
     * @request GET:/bigorequest/{id}
     * @secure
     * @response `200` `Record<string,any>` Данные заявки с классами сложности
     * @response `400` `Record<string,string>` Неверный ID
     * @response `403` `Record<string,string>` Доступ запрещен
     * @response `404` `Record<string,string>` Заявка не найдено
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    bigorequestDetail: (
      { id, ...query }: BigorequestDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, any>, Record<string, string>>({
        path: `/bigorequest/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет логическое удаление заявки
     *
     * @tags bigorequests
     * @name DeleteBigorequestDelete
     * @summary Удалить заявку
     * @request DELETE:/bigorequest/{id}/delete-bigorequest
     * @secure
     * @response `200` `Record<string,string>` Статус удаления
     * @response `400` `Record<string,string>` Неверный запрос
     * @response `403` `Record<string,string>` Доступ запрещен
     * @response `404` `Record<string,string>` Заявка не найдена
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    deleteBigorequestDelete: (
      { id, ...query }: DeleteBigorequestDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, string>, Record<string, string>>({
        path: `/bigorequest/${id}/delete-bigorequest`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные заявки
     *
     * @tags bigorequests
     * @name EditBigorequestUpdate
     * @summary Изменить заявку
     * @request PUT:/bigorequest/{id}/edit-bigorequest
     * @secure
     * @response `200` `SerializerBigORequestJSON` Обновленная заявка
     * @response `400` `Record<string,string>` Неверные данные
     * @response `404` `Record<string,string>` Заявка не найдена
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    editBigorequestUpdate: (
      { id, ...query }: EditBigorequestUpdateParams,
      bigorequest: SerializerBigORequestJSON,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerBigORequestJSON, Record<string, string>>({
        path: `/bigorequest/${id}/edit-bigorequest`,
        method: "PUT",
        body: bigorequest,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Изменяет статус заявки (только для модераторов)
     *
     * @tags bigorequests
     * @name FinishBigorequestUpdate
     * @summary Завершить заявку
     * @request PUT:/bigorequest/{id}/finish-bigorequest
     * @secure
     * @response `200` `SerializerBigORequestJSON` Результат модерации
     * @response `400` `Record<string,string>` Неверный запрос
     * @response `403` `Record<string,string>` Доступ запрещен
     * @response `404` `Record<string,string>` Заявка не найдена
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    finishBigorequestUpdate: (
      { id, ...query }: FinishBigorequestUpdateParams,
      status: SerializerStatusJSON,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerBigORequestJSON, Record<string, string>>({
        path: `/bigorequest/${id}/finish-bigorequest`,
        method: "PUT",
        body: status,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит заявку в статус "formed"
     *
     * @tags bigorequests
     * @name FormBigorequestUpdate
     * @summary Сформировать заявку
     * @request PUT:/bigorequest/{id}/form-bigorequest
     * @secure
     * @response `200` `SerializerBigORequestJSON` Сформированная заявка
     * @response `400` `Record<string,string>` Неверный запрос
     * @response `403` `Record<string,string>` Доступ запрещен
     * @response `404` `Record<string,string>` Заявка не найдена
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    formBigorequestUpdate: (
      { id, ...query }: FormBigorequestUpdateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerBigORequestJSON, Record<string, string>>({
        path: `/bigorequest/${id}/form-bigorequest`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  compclassrequest = {
    /**
     * @description Обновляет параметры класса сложности в конкретной заявке
     *
     * @tags CompClassRequest
     * @name CompclassrequestUpdate
     * @summary Изменить данные класса сложности в заявке
     * @request PUT:/compclassrequest/{compclass_id}/{bigo_request_id}
     * @secure
     * @response `200` `SerializerCompClassRequestJSON` Обновленные данные
     * @response `400` `Record<string,string>` Неверные данные
     * @response `404` `Record<string,string>` Не найдено
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    compclassrequestUpdate: (
      { compclassId, bigoRequestId, ...query }: CompclassrequestUpdateParams,
      data: SerializerCompClassRequestJSON,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerCompClassRequestJSON, Record<string, string>>(
        {
          path: `/compclassrequest/${compclassId}/${bigoRequestId}`,
          method: "PUT",
          body: data,
          secure: true,
          type: ContentType.Json,
          format: "json",
          ...params,
        },
      ),

    /**
     * @description Удаляет связь класса сложности и заявки
     *
     * @tags CompClassRequest
     * @name CompclassrequestDelete
     * @summary Удалить класс сложности из заявки
     * @request DELETE:/compclassrequest/{compclass_id}/{bigo_request_id}
     * @secure
     * @response `200` `SerializerBigORequestJSON` Обновленная заявка
     * @response `400` `Record<string,string>` Неверные ID
     * @response `403` `Record<string,string>` Доступ запрещен
     * @response `404` `Record<string,string>` Не найдено
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    compclassrequestDelete: (
      { compclassId, bigoRequestId, ...query }: CompclassrequestDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerBigORequestJSON, Record<string, string>>({
        path: `/compclassrequest/${compclassId}/${bigoRequestId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  complexclass = {
    /**
     * @description Возвращает все классы сложности или фильтрует по степени
     *
     * @tags CompClasses
     * @name ComplexclassList
     * @summary Получить список классов сложности
     * @request GET:/complexclass
     * @response `200` `(SerializerComplexClassJSON)[]` Список классов сложности
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    complexclassList: (
      query: ComplexclassListParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerComplexClassJSON[], Record<string, string>>({
        path: `/complexclass`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новый класс сложности и возвращает его данные
     *
     * @tags CompClasses
     * @name CreateCompclassCreate
     * @summary Создать новый класс сложности
     * @request POST:/complexclass/create-compclass
     * @secure
     * @response `201` `SerializerComplexClassJSON` Созданный класс сложности
     * @response `400` `Record<string,string>` Неверные данные
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    createCompclassCreate: (
      device: SerializerComplexClassJSON,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerComplexClassJSON, Record<string, string>>({
        path: `/complexclass/create-compclass`,
        method: "POST",
        body: device,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о классе сложности по его идентификатору
     *
     * @tags CompClasses
     * @name ComplexclassDetail
     * @summary Получить класс сложности по ID
     * @request GET:/complexclass/{id}
     * @response `200` `SerializerComplexClassJSON` Данные класса сложности
     * @response `400` `Record<string,string>` Неверный ID
     * @response `404` `Record<string,string>` Устройство не найдено
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    complexclassDetail: (
      { id, ...query }: ComplexclassDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerComplexClassJSON, Record<string, string>>({
        path: `/complexclass/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для класса сложности и возвращает обновленные данные
     *
     * @tags CompClasses
     * @name AddPhotoCreate
     * @summary Загрузить изображение устройства
     * @request POST:/complexclass/{id}/add-photo
     * @secure
     * @response `200` `Record<string,any>` Статус загрузки и данные класса сложности
     * @response `400` `Record<string,string>` Неверный запрос или файл
     * @response `404` `Record<string,string>` Класс сложности не найден
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    addPhotoCreate: (
      { id, ...query }: AddPhotoCreateParams,
      data: AddPhotoCreatePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, any>, Record<string, string>>({
        path: `/complexclass/${id}/add-photo`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет класс сложности в заявку-черновик пользователя
     *
     * @tags CompClasses
     * @name AddToBigorequestCreate
     * @summary Добавить класс сложности в расчёт
     * @request POST:/complexclass/{id}/add-to-bigorequest
     * @secure
     * @response `200` `SerializerBigORequestJSON` Расчёт с добавленным классом сложности
     * @response `201` `SerializerBigORequestJSON` Создан новый расчёт
     * @response `400` `Record<string,string>` Неверный запрос
     * @response `404` `Record<string,string>` Класс сложности не найден
     * @response `409` `Record<string,string>` Класс сложности уже в расчёте
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    addToBigorequestCreate: (
      { id, ...query }: AddToBigorequestCreateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerBigORequestJSON, Record<string, string>>({
        path: `/complexclass/${id}/add-to-bigorequest`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет логическое удаление класса сложности по ID
     *
     * @tags CompClasses
     * @name DeleteCompclassDelete
     * @summary Удалить класс сложности
     * @request DELETE:/complexclass/{id}/delete-compclass
     * @secure
     * @response `200` `Record<string,string>` Статус удаления
     * @response `400` `Record<string,string>` Неверный ID
     * @response `404` `Record<string,string>` Класс сложности не найден
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    deleteCompclassDelete: (
      { id, ...query }: DeleteCompclassDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, string>, Record<string, string>>({
        path: `/complexclass/${id}/delete-compclass`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о классе сложности по ID
     *
     * @tags CompClasses
     * @name EditCompclassUpdate
     * @summary Изменить данные класса сложности
     * @request PUT:/complexclass/{id}/edit-compclass
     * @secure
     * @response `200` `SerializerComplexClassJSON` Обновленный класс сложности
     * @response `400` `Record<string,string>` Неверные данные
     * @response `404` `Record<string,string>` Класс сложности не найден
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    editCompclassUpdate: (
      { id, ...query }: EditCompclassUpdateParams,
      compclass: SerializerComplexClassJSON,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerComplexClassJSON, Record<string, string>>({
        path: `/complexclass/${id}/edit-compclass`,
        method: "PUT",
        body: compclass,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Принимает логин/пароль, возвращает jwt-токен в формате {"token":"..."}.
     *
     * @tags users
     * @name SigninCreate
     * @summary Вход (получение токена)
     * @request POST:/users/signin
     * @response `200` `Record<string,string>` token
     * @response `400` `Record<string,string>` Неверный запрос
     * @response `404` `Record<string,string>` Пользователь не найден
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    signinCreate: (
      credentials: SerializerUserJSON,
      params: RequestParams = {},
    ) =>
      this.http.request<Record<string, string>, Record<string, string>>({
        path: `/users/signin`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет токен текущего пользователя из хранилища. Возвращает {"status":"signed_out"}.
     *
     * @tags users
     * @name SignoutCreate
     * @summary Выход (удаление токена)
     * @request POST:/users/signout
     * @secure
     * @response `200` `Record<string,string>` status
     * @response `400` `Record<string,string>` Проблема с получением user_id
     * @response `500` `Record<string,string>` Внутренняя ошибка при удалении токена
     */
    signoutCreate: (params: RequestParams = {}) =>
      this.http.request<Record<string, string>, Record<string, string>>({
        path: `/users/signout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Регистрирует нового пользователя. Возвращает URL созданного ресурса в Location и тело созданного пользователя.
     *
     * @tags users
     * @name SignupCreate
     * @summary Регистрация пользователя
     * @request POST:/users/signup
     * @response `201` `SerializerUserJSON` Пользователь создан
     * @response `400` `Record<string,string>` Ошибка валидации или входных данных
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    signupCreate: (user: SerializerUserJSON, params: RequestParams = {}) =>
      this.http.request<SerializerUserJSON, Record<string, string>>({
        path: `/users/signup`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные профиля (доступен только тот, чей UUID совпадает с user_id в токене).
     *
     * @tags users
     * @name InfoList
     * @summary Получить профиль пользователя
     * @request GET:/users/{login}/info
     * @secure
     * @response `200` `SerializerUserJSON` Профиль пользователя
     * @response `400` `Record<string,string>` Проблема с авторизацией/получением user_id"}
     * @response `403` `Record<string,string>` Пользователи не совпадают
     * @response `404` `Record<string,string>` Пользователь не найден
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    infoList: (
      { login, ...query }: InfoListParams,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerUserJSON, Record<string, string>>({
        path: `/users/${login}/info`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет профиль пользователя (может делать только сам пользователь).
     *
     * @tags users
     * @name InfoUpdate
     * @summary Изменить профиль пользователя
     * @request PUT:/users/{login}/info
     * @secure
     * @response `200` `SerializerUserJSON` Обновлённый профиль
     * @response `400` `Record<string,string>` Ошибка запроса или авторизации
     * @response `403` `Record<string,string>` Доступ запрещён
     * @response `404` `Record<string,string>` Пользователь не найден
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    infoUpdate: (
      { login, ...query }: InfoUpdateParams,
      user: SerializerUserJSON,
      params: RequestParams = {},
    ) =>
      this.http.request<SerializerUserJSON, Record<string, string>>({
        path: `/users/${login}/info`,
        method: "PUT",
        body: user,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
