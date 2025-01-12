import {atom} from 'recoil';

const updatesAtom = atom({
    key: 'updatesAtom',
    default: [],
});

export default updatesAtom;