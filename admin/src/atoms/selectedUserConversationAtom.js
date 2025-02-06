import {atom} from 'recoil';

const selectedUserConversationAtom = atom({
    key: 'selectedUserConversationAtom',
    default: {},
});

export default selectedUserConversationAtom;