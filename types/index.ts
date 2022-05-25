interface APIResponseSuccess<DataType> {
  success: true;
  data: DataType;
}
interface APIResponseFailed {
  success: false;
  error_type: string;
}
export type APIResponseType<DataType = undefined> =
  | APIResponseSuccess<DataType>
  | APIResponseFailed;
