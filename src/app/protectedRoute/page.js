import ChatRoom from "@/components/ChatRoom";
import PostForm from "../../components/PostForm";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function CreatePostPage(){
    return(
        <ProtectedRoute>
            <PostForm />
            <ChatRoom />
        </ProtectedRoute>
    )
}