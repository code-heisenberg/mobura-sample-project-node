//DATA ENTER SECTION FOR TABLE-USER
const { User_temps, Users, Logins, candi_Role_Permissions, Candidates, sequelize } = require('../configs/postgresdatabase');
const { Op, literal } = require('sequelize');

const CandidatesModel = {
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
    returnUserRightsData: async (data) => {
        const quotedFields = ["'" + String(data).split(",").join(',') + "'"];
        const cleanedString = quotedFields.toString().replace(/^'|'$/g, '');
        // Split the string into an array
        const fieldsArray = cleanedString.split(',');
        // Convert the array into an object with each field as a key and value

        let fieldsObject = {};
        fieldsArray.forEach(field => {
            fieldsObject[field] = field;
        });
        //console.log("fieldsArray->"+JSON.stringify(fieldsObject));
        return new Promise((resolve, reject) => {
            Candidates.findOne({
                attributes: Object.keys(fieldsObject), // Use Object.keys() to get array of keys
                raw: true
            })
                .then(user => {
                    let userObj = {}; // Object to store the result
                    Object.keys(fieldsObject).forEach(field => {
                        userObj[field] = user[field]; // Assign each field and its value

                    });
                    //console.log(userObj);
                    resolve(userObj);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        });


    },
    usersRights: async (user_name, apiname, field) => {
        try {
            //     //Code to Check UserRights
            
            if (field) {
                console.log(user_name,apiname,field);
                const permissions = await candi_Role_Permissions.findOne({
                    attributes: ['role'], // Fields you want to select
                    where: {
                        user_name: user_name,
                        datadelete: field,
                        pageactions: {
                            [Op.like]: `%${apiname}%`
                        }

                    }
                });
                //console.log(permissions);
                return permissions;
            }
            //         //console.log(permissions);
                    

            //     }
            // } catch (error) {
            //     console.error('Error fetching user names:', error);
            //     throw error; // Rethrow the error to handle it in the caller
            // }

            //Code Below is to Fetch Only Needed column value without Column-Names
            if(!field)
            {
            const excludeColumns = ['user_id', 'user_name', 'role', 'datasearch', 'dataupdate', 'datadelete', 'pageactions', 'send_sms_service', 'send_whatsapp_service', 'send_email_service', 'createdAt', 'updatedAt']
            const users = await candi_Role_Permissions.findAll({
                attributes: { exclude: excludeColumns },
                where: {
                    user_name: user_name,
                    pageactions: apiname,
                    [Op.or]: Object.keys(candi_Role_Permissions.rawAttributes).map(field => {
                        return {
                            [field]: {
                                [Op.not]: null
                            }
                        };
                    })
                }
            });
            if (users.length > 0) {
                let refinedDataArray = users.map(user => {
                    const refinedData = Object.values(user.toJSON()).filter(value => value !== null);
                    return refinedData;

                });
                //console.log(refinedDataArray);
                let fieldsToRetrieve = refinedDataArray;
                return refinedDataArray; // Ensure you return the refined data here

            } else {
                return null; // Or any appropriate value when no users are found
            }
            // code below to get data from above refined code from Candidated Table



            // code below to get needed columns with its values
            // const excludeColumns = ['user_id', 'user_name', 'role', 'datasearch', 'dataupdate', 'datadelete', 'pageactions', 'send_sms_service', 'send_whatsapp_service', 'send_email_service', 'createdAt', 'updatedAt'];
            // const users = await candi_Role_Permissions.findAll({
            //     where: {
            //         user_name: user_name,
            //         pageactions: apiname,
            //         [Op.or]: Object.keys(candi_Role_Permissions.rawAttributes).map(field => {
            //             return {
            //                 [field]: {
            //                     [Op.not]: null
            //                 }
            //             };
            //         })
            //     }
            // });

            // if (users.length > 0) {
            //     const refinedDataArray = users.map(user => {
            //         const refinedData = {};
            //         Object.keys(user.toJSON()).forEach(key => {
            //             if (!excludeColumns.includes(key) && user[key] !== null) {
            //                 refinedData[key] = user[key];
            //             }
            //         });
            //         return refinedData;
            //     });
            //     console.log("Refined data:", refinedDataArray);
            // } else {
            //     console.log("No users found or all fields are empty");
            // }
        }
        } catch (err) {

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
    dataUpdate: async (full_name, data) => {
        try {

            // Update operation
            console.log(full_name);
            try {
                // Find the user
                const user = await Candidates.findOne({
                    where: {
                        full_name: full_name,
                    }
                });

                // If user not found, return null or handle accordingly
                if (!user) {
                    return null; // Or throw an error
                }
                // Update the user with new data
                console.log("data from tele-caller" + data);
                await user.update(data);
                // Fetch the updated user (optional)
                const updatedUser = await Candidates.findOne({
                    where: {
                        full_name: full_name,
                    }
                });
                return updatedUser;
            } catch (error) {
                console.error('Error updating user:', error);
                throw error; // Rethrow the error for handling in the calling function
            }


        } catch (error) {
            console.error("Error creating user:", error);
        }

    },

}
module.exports = CandidatesModel;

