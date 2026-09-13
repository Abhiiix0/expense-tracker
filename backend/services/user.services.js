import User from "../model/user.js";

export const findOrCreateGoogleUser = async (data) => {
  try {
      let user = await User.findOne({ googleId: data.sub })
      if(user) return user

      user = await User.findOne({ email: data.email })
      if (user) {
          user.googleId = data.sub;
          user.profileImg = data.profileImg || data.picture;
          await user.save();
          return user;
      }

      user = await User.create({
      googleId: data.sub,
      email: data.email,
      name: data.name,
      profileImg: data.picture,
      })

    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("An account with this email already exists");
    }
    console.error("findOrCreateGoogleUser failed:", error.message);
    throw error; // let the controller decide the HTTP response
  }
};

export const getUserById = async (id) => {
    const user = await User.findById(id)
    if (!user) {
    return null
    }
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImg: user.profileImg
    };
}
