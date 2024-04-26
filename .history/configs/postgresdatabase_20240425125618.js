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
    }
 
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
      allowNull: false
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
})();

  //module.exports = user_temp,users;
  module.exports = {User_temps,Users,Logins,sequelize};
