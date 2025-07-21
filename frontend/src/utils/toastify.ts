import { toast } from "react-hot-toast";

export const withToast = async <T>(
  promise: Promise<T>,
  errorMessage = "Something went wrong"
): Promise<T> => {
  try {
    return await promise;
  } catch (error: any) {
    const msg = error?.message || errorMessage;
    toast.error(msg);
    throw error;
  }
};
