import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("admin", "intern"),
    allowNull: false,
  },

  otp: {
    type: DataTypes.STRING,
  },

  otpExpiry: {
    type: DataTypes.DATE,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default User;