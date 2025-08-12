
// Functions
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import userConversationAtom from "../atoms/userConversationAtom";
import userAtom from "../atoms/userAtom";

  //BASEURL
  import { baseURL as BASEURL } from "../config/baseURL.js";

const FetchAllUserConversations = () => {
    // Functions
    const showToast = useShowToast();
    // State
    const [userConversations, setUserConversations] = useRecoilState(userConversationAtom);
    const user = useRecoilValue(userAtom);

    
    // Fetch
    const fetchAllUserConversationsFunc = async () => {
        try {
          const res = await fetch(`${BASEURL}/api/userChats/getAllUserConversation`, {
            method: "POST",
            headers: {
              "Content-Type":"application/json",
              "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({userId: user?._id})
          });
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setUserConversations(data.userConversations);
          // console.log(data);
        } catch (error) {
          console.log(error);
          showToast("Error", error, "error");
        }
      };
    
      return fetchAllUserConversationsFunc;
}

export default FetchAllUserConversations