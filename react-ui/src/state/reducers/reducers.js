const INITIAL_STATE = {
    email: '',
    role: ''
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_EMAIL':
            return {
                ...state, email: action.payload,
            };
        case 'SET_ROLE':
            return {
                ...state, role: action.payload
            }
        default: return state;
    }
};

export default reducer;