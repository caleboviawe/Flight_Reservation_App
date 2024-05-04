import axios from "axios";

class UserValidation {
    static async validate(values) {
        try {
            const res = await axios.get("http://localhost:3001/users");
            let user = {};

            let matchFound = res.data.some((obj) => {
                if (obj.Email === values.email && obj.Password === values.password) {
                    user = obj;
                    return true;
                }
                else {
                    return false;
                }
            });

            if (matchFound) {
                return [1, 1, user];
            } else {
                const emailMatchFound = res.data.some((obj) => {
                    return obj.Email === values.email;
                });

                if (emailMatchFound) {
                    return [1, 0, user];
                } else {
                    return [0, 0, user];
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default UserValidation;

