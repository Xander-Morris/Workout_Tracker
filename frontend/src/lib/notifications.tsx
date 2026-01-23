import { toast } from "react-hot-toast";

export const Notifications = {
    showError: (error: any) => {
        let errorMessage = error.response?.data?.detail || error.message || 'An error occurred';

        if (typeof(errorMessage) != 'string') {
            errorMessage = 'An error occurred';
        }

        toast.error(errorMessage);
    },
};