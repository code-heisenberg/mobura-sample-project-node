const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'rooter', {
  host: 'localhost',
  dialect: 'postgres'
});
//Creating user_temps
const User_temps = sequelize.define('User_temps', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  dob: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
   emailverificationcode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userights: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailotp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otpvalidity: {
    type: DataTypes.STRING,
    allowNull: true
  },
   
});
//Creating User Table
const Users = sequelize.define('Users', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userights: {
      type: DataTypes.STRING,
      allowNull: false
    },
 
  });
  //Create Login-Table
  const Logins = sequelize.define('Logins', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: true
    },
   });
//Create Table roleAndPermissions
const candi_Role_Permissions = sequelize.define('candi_Role_Permissions', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true
  },
  datasearch: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dataupdate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  datadelete: {
    type: DataTypes.STRING,
    allowNull: true
  },
  send_sms_services: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pageactions: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address3: {
    type: DataTypes.STRING,
    allowNull: true
  },
  send_whatsapp_service: {
    type: DataTypes.STRING,
    allowNull: true
  },
  send_email_service: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.STRING,
    allowNull: true
  },
  languages_known: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferred_country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true
  }


 });
//Create Table roleAndPermissions
const Candidates = sequelize.define('Candidates', {
  candidate_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  place: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adhaar_pan_driving: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  send_sms_service: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferred_country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.STRING,
    allowNull: true
  },
  languages_known: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nursing_license_validity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  send_whatsapp_service: {
    type: DataTypes.STRING,
    allowNull: true
  },
  send_email_service: {
    type: DataTypes.STRING,
    allowNull: true
  }
 });

  // Create the table if it doesn't exist
(async () => {
  await User_temps.sync();
  console.log("User_temps table created!");
  await Users.sync();
  console.log("Users table created!");
  await Logins.sync();
  console.log("Login table created!");
  await candi_Role_Permissions.sync();
  console.log("candi_Role_Permissions table created!");
  await Candidates.sync();
  console.log("Candidates table created!");
  
})();

  //module.exports = user_temp,users;
  module.exports = {User_temps,Users,Logins,candi_Role_Permissions,Candidates,sequelize};
