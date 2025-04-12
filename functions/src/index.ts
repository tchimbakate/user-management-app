import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();

interface DeleteUserRequest {
    userId: string;
}

interface DeleteUserResponse {
    success: boolean;
}

export const deleteUser = onCall<DeleteUserRequest,
    Promise<DeleteUserResponse>>(
    async (request) => {
        logger.log("Received request to delete user", request.data);

        const userId = request.data.userId;
        if (!userId) {
            throw new HttpsError(
                "invalid-argument",
                "User ID is required"
            );
        }

        try {
            await getFirestore().collection("users").doc(userId).delete();
            logger.log(`Successfully deleted user ${userId}`);
            return {success: true};
        } catch (error) {
            logger.error("Error deleting user:", error);
            throw new HttpsError(
                "internal",
                "Failed to delete user"
            );
        }
    }
);