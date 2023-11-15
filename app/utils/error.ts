import { json } from "@remix-run/cloudflare";

export const HTTP_ERROR = "HTTPError";

export class HTTPError extends Error implements Error {
  private _headers: Record<string, string>;
  private _status: number;

  constructor(msg: string, status = 500, headers = {}) {
    super(msg);

    super.name = HTTP_ERROR;
    this._headers = headers;
    this._status = status;
  }

  public get headers() {
    return this._headers;
  }

  public get status() {
    return this._status;
  }

  public json() {
    return json(
      { error: this.message },
      {
        status: this.status,
        headers: {
          "cache-control": "no-store",
          ...this.headers,
        },
      }
    );
  }
}
