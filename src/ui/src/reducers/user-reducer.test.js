import { usersReducer } from "./user-reducer";

describe("User reducer", () => {
  it("Should set new users correctly", () => {
    const userId = "12345";
    const stateBefore = {
      userId: null,
      loggedIn: false,
    };

    const action = {
      type: "SET_USER",
      userId: userId,
    };

    const expected = {
      userId: userId,
      loggedIn: true,
    };

    expect(usersReducer(stateBefore, action)).toEqual(expected);
  });

  it("Should remove the user correctly", () => {
    const userId = "12345";
    const stateBefore = {
      userId: userId,
      loggedIn: true,
    };

    const action = {
      type: "REMOVE_USER",
      userId: userId,
    };

    const expected = {
      userId: null,
      loggedIn: false,
    };

    expect(usersReducer(stateBefore, action)).toEqual(expected);
  });
});
