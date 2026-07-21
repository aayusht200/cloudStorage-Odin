const getUserById = (req, res) => {
    console.log(req);
    res.send({ message: 'test' });
};

const loginUser = (req, res) => {};

const signupUser = () => {};

export { getUserById, loginUser, signupUser };
