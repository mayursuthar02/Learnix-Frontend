import {atom} from 'recoil';

const userConversationAtom = atom({
    key: 'userConversationAtom',
    default: [],
});

export default userConversationAtom;