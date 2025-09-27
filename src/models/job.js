import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Job = sequelize.define("Job", {
    id: { type: DataTypes.STRING(20), primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    platform: { type: DataTypes.ENUM("youtube","facebook"), allowNull: false },
    input: { type: DataTypes.TEXT, allowNull: false },
    outputs: { type: DataTypes.TEXT, allowNull: false }, // JSON array
    status: { type: DataTypes.STRING(20), defaultValue: "idle" },
    timezone: { type: DataTypes.STRING(64) },
    startAt: { type: DataTypes.DATE, allowNull: true },
    startedAt: { type: DataTypes.DATE, allowNull: true },
    stoppedAt: { type: DataTypes.DATE, allowNull: true },
    device: { type: DataTypes.TEXT } // JSON
  });
  return Job;
};
