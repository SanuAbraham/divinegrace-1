export const getError = (err) => {
    return err.response && err.response.data.message
        ? err.response.data.message
        : err.message
};

export const getUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo;
}