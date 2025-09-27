import { DataTypes } from "sequelize";
export default (sequelize) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM("admin","user"), defaultValue: "user" }
  });
  return User;
};
