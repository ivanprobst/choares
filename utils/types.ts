interface APIResponseSuccess {
  success: true;
  data?: any;
}
interface APIResponseFailed {
  success: false;
  error_type: string;
}
export type APIResponse = APIResponseSuccess | APIResponseFailed;
