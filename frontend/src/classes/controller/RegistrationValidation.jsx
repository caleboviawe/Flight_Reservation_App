class RegistrationValidation {
    static validate(values) {
        let errors = {};
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#(){}[\]<>'"/\\|~`_+=-])[A-Za-z\d@$!%*?&^#(){}[\]<>'"/\\|~`_+=-]{8,}$/;

        if (values.email === "") {
            errors.email = "Email should not be empty";
        } else if (!emailPattern.test(values.email)) {
            errors.email = "Invalid email format";
        } else {
            errors.email = "";
        }

        if (values.password === "") {
            errors.password = "Password should not be empty";
        } else if (!passwordPattern.test(values.password)) {
            errors.password =
                "Password should contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be a minimum of 8 characters in length";
        } else {
            errors.password = "";
        }

        return errors;
    }
}

export default RegistrationValidation;
