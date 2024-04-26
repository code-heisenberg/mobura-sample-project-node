
//DATA ENTER SECTION FOR TABLE-USER
const {User_temps,Users,Logins ,sequelize} = require('../configs/postgresdatabase');


const userModel = {
    createUser_Temp : async(email,user_name,dob,address,password,mobile,emailverificationcode,emailotp,otpvalidity)=> {
        try {
          const user_temps = await User_temps.create({ email,user_name,dob,address,password,mobile,emailverificationcode,emailotp,otpvalidity});
          console.log("User_temp created:", user_temps.toJSON());
        } catch (error) {
          console.error("Error creating user:", error);
        }
      },   
 createUsers : async(email,user_name,dob,address,password,mobile)=> {
    try {
      const users = await Users.create({ email,user_name,dob,address,password,mobile });
      console.log("User created:", users.toJSON());
      return users;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },
  userLogin: async (user_name,token) => {
    try {
    let activity="active";
    let date = Date();
    const logins = await Logins.create({ user_name,token,activity,date });
    console.log("User created:", logins.toJSON());
    return logins; 
    } catch (error) {
      console.error("Error creating user:", error);
    }    
    
  },
  usersList: async () => {
    // try {
    // const userslist = await Users.findAll();
    // //console.log("User created:", logins.toJSON());
    // return userslist; 
    // } catch (error) {
    //   console.error("Error creating user:", error);
    // }
    ////
    getAllUserList();
    function getAllUserList ()  
    {
      try {
        const users = await Users.findAll(); // Assuming usersList is a method in your UserModel that fetches all users
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Rethrow the error to handle it in the caller
      }
    };
  },
  findByUserName:  async(user_name)=> {
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
  findByEmailVerificationLink:  async(emailverificationcode)=> {
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
findByEmailVerificationOtp:  async(emailotp)=> {
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
module.exports =  userModel;

