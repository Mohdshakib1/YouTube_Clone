const initialState = JSON.parse(localStorage.getItem("Profile")) || null;

const currentuserreducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CURRENT_USER":
      return action.payload;
    default:
      return state;
  }
};

export default currentuserreducer;
