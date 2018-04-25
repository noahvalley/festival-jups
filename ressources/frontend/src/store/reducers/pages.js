const events = (state = {}, action) => {
  switch(action.type) {

    case 'setHome':
      return action.payload

    default:
      return state;
  }
}

export default events;
