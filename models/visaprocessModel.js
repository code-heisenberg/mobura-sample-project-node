
//DATA ENTER SECTION FOR TABLE-USER
const { User_temps, Users, Logins, Role_Permissions, Candidates, sequelize } = require('../configs/postgresdatabase');
const { Op,literal } = require('sequelize');

const VisaprocessModel = {
    createUser_Temp: async (email, user_name, dob, address, password, mobile, userights, emailverificationcode, emailotp, otpvalidity) => {
        try {
            const user_temps = await User_temps.create({ email, user_name, dob, address, password, mobile, userights, emailverificationcode, emailotp, otpvalidity });
            console.log("User_temp created:", user_temps.toJSON());
        } catch (error) {
            console.error("Error creating user:", error);
        }
    },
    createUsers: async (email, user_name, dob, address, password, mobile, userights) => {
        try {
            const users = await Users.create({ email, user_name, dob, address, password, mobile, userights });
            console.log("User created:", users.toJSON());
            return users;
        } catch (error) {
            console.error("Error creating user:", error);
        }
    },
    userLogin: async (user_name, token) => {
        try {
            let activity = "active";
            let date = Date();
            const logins = await Logins.create({ user_name, token, activity, date });
            console.log("User created:", logins.toJSON());
            return logins;
        } catch (error) {
            console.error("Error creating user:", error);
        }

    },
    usersList: async () => {
        try {
            const userlists = await Users.findAll({
                attributes: ['user_name'] // Fetch only the user_name field
            });
            return userlists.map(user => user.user_name);
        } catch (error) {
            console.error('Error fetching user names:', error);
            throw error; // Rethrow the error to handle it in the caller
        }

    },
    usersRights: async (user_name, apiname, field) => {
        try {
            if (field == 'email') {
                
                const permissions = await Role_Permissions.findOne({
                    attributes: ['role'], // Fields you want to select
                    where: {
                        user_name: user_name,
                                email: field,
                                apiname: {
                                    [Op.like]: `%${apiname}%`
                                }

                    }
                });
                return permissions;

            }
            if (field == 'mobile_phone') {
                console.log("Entered Mobile");
                const permissions = await Role_Permissions.findOne({
                    attributes: ['role'], // Fields you want to select
                    where: {
                        user_name: user_name,
                         mobile_phone: field,
                         apiname: {
                            [Op.like]: `%${apiname}%`
                        }

                    }
                });
                return permissions;

            }
            if (field == 'dataupdate' || field == 'datadelete' || field == 'datasearch' || field == 'dataprint' || field == 'dataupload' || field == 'datadownload') {
                    const permissions = await Role_Permissions.findOne({
                    attributes: ['role'], // Fields you want to select
                    where: {
                        user_name: user_name,
                        apiname: {
                            [Op.like]: `%${apiname}%`
                        }
                        
                    }
                });
                console.log(permissions);
                return permissions;

            }
        } catch (error) {
            console.error('Error fetching user names:', error);
            throw error; // Rethrow the error to handle it in the caller
        }

    },

    findByUserName: async (user_name) => {
        try {

            const users = await Users.findOne({
                where: { user_name }
            });
            //console.log(users); // Logging the user for debugging
            return users; // Returning the user
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }

    },
    findByEmailVerificationLink: async (emailverificationcode) => {
        try {

            const user_temps = await User_temps.findOne({
                where: { emailverificationcode }
            });
            //console.log(users); // Logging the user for debugging
            return user_temps; // Returning the user
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }

    },
    findByEmailVerificationOtp: async (emailotp) => {
        try {

            const user_temps = await User_temps.findOne({
                where: { emailotp }
            });
            //console.log(users); // Logging the user for debugging
            return user_temps; // Returning the user
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }

    },

}
module.exports = VisaprocessModel;

