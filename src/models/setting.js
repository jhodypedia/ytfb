import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Setting = sequelize.define("Setting", {
    key: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    value: { type: DataTypes.TEXT }
  });
  return Setting;
};
