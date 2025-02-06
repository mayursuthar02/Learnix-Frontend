
// Functions
import { useRecoilState } from "recoil";
import useShowToast from "../../../client/src/hooks/useShowToast";
import userConversationAtom from "../atoms/userConversationAtom";

const FetchAllUserConversations = () => {
    // Functions
    const showToast = useShowToast();
    // State
    const [userConversations, setUserConversations] = useRecoilState(userConversationAtom);

    
    // Fetch
    const fetchAllUserConversationsFunc = async () => {
        try {
          const res = await fetch("/api/userChats/getAllUserConversation");
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setUserConversations(data.userConversations);
          console.log(data);
        } catch (error) {
          console.log(error);
          showToast("Error", error, "error");
        }
      };
    
      return fetchAllUserConversationsFunc;
}

export default FetchAllUserConversations